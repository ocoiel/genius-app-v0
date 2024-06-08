export async function fetcher<T>(
  url: string,
  config?: RequestInit
): Promise<T> {
  const response = await fetch(url, config);

  const data = (await response.json()) as T;

  return data;
}
