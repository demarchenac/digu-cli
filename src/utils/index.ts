import {
  focusProfileDialog,
  goToMyProfile,
  login,
  scrapeDialogLinks,
} from "./instagram";

export const navigation = {
  instagram: {
    login: login,
    goToMyProfile: goToMyProfile,
    focusProfileDialog: focusProfileDialog,
  },
};

export const scrape = {
  instagram: {
    profileDialogLinks: scrapeDialogLinks,
  },
};
