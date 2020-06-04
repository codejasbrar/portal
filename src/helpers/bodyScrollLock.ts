const BodyScroll = {
  disable: () => document.body.style.overflow = 'hidden',
  enable: () => document.body.style.overflow = 'visible'
};

export default BodyScroll;