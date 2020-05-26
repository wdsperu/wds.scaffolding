export interface ResourceGraphql {
    searchDefault: string,
    search: string,
    form: {
      create: {
        load?: string,
        save: string
      },
      update: {
        load: string,
        save: string
      },
      others?: {
        [key: string]: string
      }
    },
    info: string
  };