import mongoose, { Schema, type Types } from "mongoose";
import { validTransitions } from "../utils/validTransitions.js";
import type { CaseStatus, Party } from "../types/case.js";

export interface ICase {
  caseNum: string;
  parties: Party[];
  hearingDate: Date;
  assignedJudge: string;
  status: CaseStatus;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const caseSchema = new Schema<ICase>(
  {
    caseNum: {
      type: String,
      required: true,
      unique: true,
      match: [/^CASE-\d{4}-\d{4}$/, "Case number must match format CASE-YYYY-NNNN"],
      trim: true,
    },
    parties: {
      type: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
            match: [/^[A-Za-z\u0600-\u06FF\s.\-']+$/, "Party name must contain only letters"],
          },
          role: {
            type: String,
            required: true,
            enum: {
              values: ["Plaintiff", "Defendant", "Witness"],
              message: "{VALUE} is not a valid role",
            },
          },
        },
      ],
      validate: {
        validator: (arr: Party[]) => {
          if (arr.length === 0) return false;
          const hasPlaintiff = arr.some((p) => p.role === "Plaintiff");
          const hasDefendant = arr.some((p) => p.role === "Defendant");
          return hasPlaintiff && hasDefendant;
        },
        message: "A case requires at least one Plaintiff and one Defendant",
      },
    },
    hearingDate: {
      type: Date,
      required: true,
      validate: {
        validator: (date: Date) => date < new Date("2100-01-01"),
        message: "Hearing date is unrealistically far in the future",
      },
    },
    assignedJudge: {
      type: String,
      required: true,
      trim: true,
      match: [/^[A-Za-z\u0600-\u06FF\s.\-']+$/, "Judge name must contain only letters"],
    },
    status: {
      type: String,
      enum: {
        values: ["Registered", "In Hearing", "Judgment", "Closed"],
        message: "{VALUE} is not a valid status",
      },
      default: "Registered",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Rules that depend on other fields or on document state live in a hook,
// where `this` is the fully typed document.
caseSchema.pre("validate", function () {
  if (this.isNew || this.isModified("hearingDate")) {
    if (!this.isNew && this.status !== "Registered") {
      this.invalidate(
        "hearingDate",
        "Hearing date cannot be changed once the case has moved past Registered"
      );
    }
    if (this.hearingDate && this.hearingDate < new Date(new Date().toDateString())) {
      this.invalidate("hearingDate", "Hearing date cannot be in the past");
    }
  }
});

caseSchema.pre("save", async function () {
  if (this.isNew) return;
  if (!this.isModified("status")) return;

  let original = this.$locals.previousStatus as CaseStatus | undefined;
  if (original === undefined) {
    const doc = await Case.findById(this._id).select("status").lean();
    original = doc?.status;
  }

  if (original && !validTransitions[original].includes(this.status)) {
    const message = `Cannot move from ${original} to ${this.status}`;
    const err = new mongoose.Error.ValidationError();
    err.addError(
      "status",
      new mongoose.Error.ValidatorError({ message, path: "status", value: this.status })
    );
    Object.assign(err, { context: message });
    throw err;
  }
});

caseSchema.index({ status: 1, createdAt: -1 });
caseSchema.index({ hearingDate: 1 });
caseSchema.index({ createdAt: -1 });

export const Case = mongoose.model<ICase>("Case", caseSchema);