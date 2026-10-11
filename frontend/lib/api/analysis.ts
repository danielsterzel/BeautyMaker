// const response = await fetch("/api/v1/analysis/stream", {
//   method: "POST",
// });

// const reader = response.body!.getReader();
// const decoder = new TextDecoder();

// while (true) {
//   const { done, value } = await reader.read();

//   if (done) break;

//   const chunk = decoder.decode(value, { stream: true });
//   setResponseText((current) => current + chunk);
// }

// setIsStreaming(false);
import { env } from "../env";
import { useAuthStore } from "../storage";

const URL = `${env.NEXT_PUBLIC_API_URL}/api/v1/analysis/stream`;

export async function streamAnalysis(onChunk: (chunk: string) => void) {
  const access_token = useAuthStore.getState().accessToken;

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  if (!response.body) {
    throw new Error("Response does not contain a stream");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while(true)
    {
        const {done, value} = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, {stream: true});
        onChunk(chunk)

    }

}
