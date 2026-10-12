import { z } from 'zod';

const nonNegativeIntOrNull = z
  .number()
  .nullable()
  .optional()
  .refine((v) => v == null || Number.isNaN(v) || (Number.isInteger(v) && v >= 0), {
    message: '單位數量必須為非負整數',
  });

const nonNegativeNumberOrNull = z
  .number()
  .nullable()
  .optional()
  .refine((v) => v == null || Number.isNaN(v) || v >= 0, {
    message: '面積不可為負數',
  });

const parkingIntOrNull = z
  .number()
  .nullable()
  .optional()
  .refine((v) => v == null || Number.isNaN(v) || (Number.isInteger(v) && v >= 0), {
    message: '車位數量必須為非負整數',
  });

const unitTypeDataSchema = z
  .object({
    saleableAreaMin: nonNegativeNumberOrNull,
    saleableAreaMax: nonNegativeNumberOrNull,
    areaDisplayOverride: z.string().nullable().optional(),
    inventoryCount: nonNegativeIntOrNull,
  })
  .superRefine((data, ctx) => {
    if (
      data.saleableAreaMin != null &&
      data.saleableAreaMax != null &&
      data.saleableAreaMax < data.saleableAreaMin
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '最大實用面積不可小於最小實用面積',
        path: ['saleableAreaMax'],
      });
    }
  });

const parkingItemSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, '自訂車位項目名稱不可留空'),
  count: parkingIntOrNull,
  notes: z.string().nullable().optional(),
  isRequired: z.boolean().optional(),
});

export const projectFormSchema = z
  .object({
    projectNameZh: z.string().nullable().optional(),
    projectNameEn: z.string().nullable().optional(),
    developer: z.enum(['sunhungkai', 'ck', 'henderson', 'wheelock', 'newworld', 'other']),
    developerOther: z.string().nullable().optional(),
    district: z.enum(['hong-kong-island', 'kowloon', 'new-territories', 'other']),
    districtOther: z.string().nullable().optional(),
    districtDetail: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    isDemo: z.boolean().optional(),
    unitTypes: z.object({
      studio: unitTypeDataSchema,
      oneBedroom: unitTypeDataSchema,
      twoBedrooms: unitTypeDataSchema,
      threeBedrooms: unitTypeDataSchema,
      fourBedrooms: unitTypeDataSchema,
    }),
    clubhouse: z.object({
      clubhouseAreaSqFt: nonNegativeNumberOrNull,
      clubhouseAreaDisplayOverride: z.string().nullable().optional(),
      clubhouseNotes: z.string().nullable().optional(),
      communalGardenOrPlayAreaSqFt: nonNegativeNumberOrNull,
      communalGardenOrPlayAreaDisplayOverride: z.string().nullable().optional(),
      communalGardenOrPlayAreaNotes: z.string().nullable().optional(),
    }),
    parking: z.object({
      residentParkingSpaces: parkingIntOrNull,
      others: parkingIntOrNull,
      totalResidentialUnits: parkingIntOrNull,
      customItems: z.array(parkingItemSchema),
      remarks: z.string().nullable().optional(),
    }),
  })
  .superRefine((data, ctx) => {
    const zh = data.projectNameZh?.trim();
    const en = data.projectNameEn?.trim();
    if (!zh && !en) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '請至少輸入中文或英文樓盤名稱',
        path: ['projectNameZh'],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '請至少輸入中文或英文樓盤名稱',
        path: ['projectNameEn'],
      });
    }
    if (data.developer === 'other' && !data.developerOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '選擇「其他」發展商時，請輸入發展商名稱',
        path: ['developerOther'],
      });
    }
    if (data.district === 'other' && !data.districtOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '選擇「其他」地區時，請輸入地區名稱',
        path: ['districtOther'],
      });
    }
  });

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
