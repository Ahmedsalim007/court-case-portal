import mongoose from 'mongoose';
import { validTransitions } from '../utils/validTransitions.js';

const caseSchema = new mongoose.Schema(
  {
    caseNum: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^CASE-\d{4}-\d{4}$/,
        'Case number must match format CASE-YYYY-NNNN',
      ],
      trim: true,
    },
    parties: {
      type: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
            match: [
              /^[A-Za-z\u0600-\u06FF\s.\-']+$/,
              'Party name must contain only letters',
            ],
          },
          role: {
            type: String,
            required: true,
            enum: {
              values: ['Plaintiff', 'Defendant', 'Witness'],
              message: '{VALUE} is not a valid role',
            },
          },
        },
      ],
      validate: {
        validator: (arr) => {
          if (arr.length === 0) return false;
          const hasPlaintiff = arr.some((p) => p.role === 'Plaintiff');
          const hasDefendant = arr.some((p) => p.role === 'Defendant');
          return hasPlaintiff && hasDefendant;
        },
        message: 'A case requires at least one Plaintiff and one Defendant',
      },
    },
    hearingDate: {
      type: Date,
      required: true,
      validate: [
        {
          validator: (date) => date < new Date('2100-01-01'),
          message: 'Hearing date is unrealistically far in the future',
        },
        {
          validator: function (date) {
            if (!this.isNew && !this.isModified('hearingDate')) return true;
            return date >= new Date(new Date().toDateString());
          },
          message: 'Hearing date cannot be in the past',
        },
        {
          validator: function () {
            if (this.isNew) return true;
            if (!this.isModified('hearingDate')) return true;
            return this.status === 'Registered';
          },
          message: 'Hearing date cannot be changed once the case has moved past Registered',
        },
      ],
    },
    assignedJudge: {
      type: String,
      required: true,
      trim: true,
      match: [/^[A-Za-z\u0600-\u06FF\s.\-']+$/, 'Judge name must contain only letters'],
    },
    status: {
      type: String,
      enum: {
        values: ['Registered', 'In Hearing', 'Judgment', 'Closed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Registered',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

caseSchema.pre('save', async function () {
  if (this.isNew) return;
  if (!this.isModified('status')) return;
 
  let original = this.$locals.previousStatus;
  if (original === undefined) {
    const doc = await this.constructor.findById(this._id).select('status').lean();
    original = doc?.status;
  }
 
  if (original && !validTransitions[original].includes(this.status)) {
    const err = new mongoose.Error.ValidationError(this);
    err.addError('status', new mongoose.Error.ValidatorError({
      message: `Cannot move from ${original} to ${this.status}`,
      path: 'status',
      value: this.status,
    }));
    err.context = `Cannot move from ${original} to ${this.status}`;
    throw err; // modern Kareem: fail a hook by throwing, not next(err)
  }
});

export const Case = mongoose.model('Case', caseSchema);