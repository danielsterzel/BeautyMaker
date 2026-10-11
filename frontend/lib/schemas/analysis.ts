
import z from "zod";

export const analysisRead = z.object({
    id: z.uuid(),
    concerns: z.array(z.string()),
    shortAnalysis: z.string(),
    fullAnalysis: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
});

export const analysisWrite = z.object({
    concerns: z.array(z.string()),
    shortAnalysis: z.string(),
    fullAnalysis: z.string(),
})

export type AnalysisRead = z.infer<typeof analysisRead>
export type AnalysisWrite = z.infer<typeof analysisWrite>