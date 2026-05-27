import axios from "axios";

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
    const { data } = await axios.get<{
      erro?: boolean;
      logradouro?: string;
      bairro?: string;
      localidade?: string;
      uf?: string;
    }>(`https://viacep.com.br/ws/${cepDigits}/json/`);

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
