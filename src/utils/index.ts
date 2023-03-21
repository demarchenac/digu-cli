import {
  focusProfileDialog,
  goToProfile,
  login,
  scrapeDialogLinks,
} from "./instagram";

export const navigation = {
  instagram: {
    login: login,
    goToProfile: goToProfile,
    focusProfileDialog: focusProfileDialog,
  },
};

export const scrape = {
  instagram: {
    profileDialogLinks: scrapeDialogLinks,
  },
};
