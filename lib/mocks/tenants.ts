export type Tenant = {
  id: string;
  name: string;
  initials: string;
  brandColor: string;
  imageUrl?: string;
};

export const mockTenants: Tenant[] = [
  {
    id: "emcammp",
    name: "Emcammp",
    initials: "EM",
    brandColor: "#26995a",
    imageUrl: "https://play-lh.googleusercontent.com/eVY9kqc4Xxz2qXvwc_M_62TFmMpJwjQr9pqQhgATYnsj8jShCqSy-Q50FbFsIBdvoQ",
  },
  {
    id: "conx",
    name: "Conx",
    initials: "CX",
    brandColor: "#e65100",
  },
];

export const mockSingleTenant: Tenant[] = [
  {
    id: "imobkeys",
    name: "Imobkeys",
    initials: "IK",
    brandColor: "#0962d7",
    imageUrl: "/logo/logo.png",
  },
];
