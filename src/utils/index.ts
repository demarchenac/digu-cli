import {
  focusProfileDialog,
  goToMyProfile,
  goToUserProfile,
  login,
  scrapeDialogLinks,
  unfollowCurrentProfile,
  unfollowUser,
} from "./instagram";

export const navigation = {
  instagram: {
    focusProfileDialog: focusProfileDialog,
    goToMyProfile: goToMyProfile,
    goToUserProfile: goToUserProfile,
    login: login,
    unfollowCurrentProfile: unfollowCurrentProfile,
    unfollowUser: unfollowUser,
  },
};

export const scrape = {
  instagram: {
    profileDialogLinks: scrapeDialogLinks,
  },
};
