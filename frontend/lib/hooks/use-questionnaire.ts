"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { submitQuestionnaireAnswers } from "@/lib/api/questionnaire";
import { currentUserQueryKey } from "@/lib/hooks/use-auth";

export function useSaveQuestionnaireMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitQuestionnaireAnswers,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
    },
  });
}
