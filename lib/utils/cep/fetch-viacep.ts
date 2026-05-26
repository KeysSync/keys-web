export type ViaCepAddress = {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
};

export async function fetchAddressByCep(
  cepDigits: string,
): Promise<ViaCepAddress | null> {
  if (cepDigits.length !== 8) return null;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      erro?: boolean;
      logradouro?: string;
      bairro?: string;
      localidade?: string;
      uf?: string;
    };
    if (data.erro) return null;
    return {
      street: data.logradouro ?? "",
      neighborhood: data.bairro ?? "",
      city: data.localidade ?? "",
      state: data.uf ?? "",
    };
  } catch {
    return null;
  }
}
