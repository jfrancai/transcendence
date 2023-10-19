const IMAGES = {
  logo_svg: new URL('../../images/icons/42_Logo.svg', import.meta.url).href,
  logo_png: new URL('../../images/42_Logo.svg.png', import.meta.url).href,
  background: new URL('../../images/background.png', import.meta.url).href,
  background_profile: new URL(
    '../../images/background_profile.png',
    import.meta.url
  ).href,
  upload: new URL('../../images/upload.png', import.meta.url).href,
  option_wheel: new URL('../../images/icons/option.png', import.meta.url).href,
  cross: new URL('../../images/icons/cross.png', import.meta.url).href,
  add_friends: new URL('../../images/icons/add-friends.png', import.meta.url)
    .href,
  remove_friends: new URL(
    '../../images/icons/remove-friends.png',
    import.meta.url
  ).href
};

export default IMAGES;
