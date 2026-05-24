export type Tenant = {
  id: string;
  name: string;
  initials: string;
  brandColor: string;
  imageUrl?: string;
};

export const mockTenants: Tenant[] = [
  {
    id: "Arlecchino",
    name: "Arlecchino",
    initials: "AC",
    brandColor: "#26995a",
    imageUrl: "https://i.pinimg.com/736x/d5/d8/27/d5d827ff9f9d946b4aa790ba43a907c4.jpg",
  },
  {
    id: "Maviuka",
    name: "Maviuka",
    initials: "MK",
    brandColor: "#26995a",
    imageUrl: "https://i.pinimg.com/736x/a3/32/38/a33238f1346fc77f25f36bb1b8397bb1.jpg",
  },
  {
    id: "Paprika",
    name: "Paprika",
    initials: "PK",
    brandColor: "#e65100",
    imageUrl: "https://i.pinimg.com/736x/27/4c/69/274c693a3ffa8740c9f21d6ba2e1fe44.jpg",
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
