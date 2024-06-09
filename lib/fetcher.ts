export async function fetcher<T>(
  url: string,
  query?: string,
  config?: RequestInit
): Promise<T> {
  const params = new URLSearchParams();

  if (query) params.set("q", query);

  const response = await fetch(`${url}?${params.toString()}`, config);

  if (!response.ok) throw new Error(await response.text());

  const data = (await response.json()) as T;

  return data;
}
