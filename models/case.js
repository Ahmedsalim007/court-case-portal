import mongoose from 'mongoose';

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
              /^[A-Za-z\s.\-']+$/,
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
        validator: (arr) => arr.length > 0,
        message: 'At least one Party is required',
      },
    },
    hearingDate: {
      type: Date,
      required: true,
      validate: {
        validator: (date) => date < new Date('2100-01-01'),
        message: 'Hearing date is unrealistically far in the future',
      },
    },
    assignedJudge: {
      type: String,
      required: true,
      trim: true,
      match: [/^[A-Za-z\s.\-']+$/, 'Judge name must contain only letters'],
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

export const Case = mongoose.model('Case', caseSchema);