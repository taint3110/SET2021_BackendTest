export const customerRoutes : {
  signup: string,
  login: string,
  getme: string,
  readAgency: string,
  readTransaction: string,
  readBilling: string
  
} = {
  signup: "/signup",
  login: "/login",
  getme: "/customers/me",
  readAgency: "/readAgency{id}",
  readTransaction: "/customers/readTransaction{id}",
  readBilling: "/customers/readBilling{id}",
}

export const agencyRoutes : {
  readProduct: string,
  createProduct: string,
  updateProduct: string,
  deleteProduct: string,
  readTransaction: string,
  readBilling: string
} = {
  readProduct: "/agencies/readProduct/{id}",
  createProduct: "/agencies/createProduct{id}",
  updateProduct: "/agencies/updateProduct/{id}",
  deleteProduct: "/agencies/deleteProduct/{id}",
  readTransaction: "/agencies/readTransaction{id}",
  readBilling: "/agencies/readBilling{id}",
}


export const adminRoutes : {
  readAgency: string,
  createAgency: string,
  updateAgency: string,
  deleteAgency: string,
  readTransaction: string,
  readBilling: string
} = {
  readAgency: "/admins/readAgency/{id}",
  createAgency: "/admins/createAgency",
  updateAgency: "/admins/updateAgency/{id}",
  deleteAgency: "/admins/deleteAgency/{id}",
  readTransaction: "/admins/readTransaction{id}",
  readBilling: "/admins/readBilling{id}",
}

