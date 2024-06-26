const MAX_SM_SIZE = 576
const MAX_XL_SIZE = 1599
const MIN_XXL_SIZE = 1600

export const isMobile = `max-width: ${MAX_SM_SIZE}px`
export const isTablet = `max-width: ${MAX_XL_SIZE}px`
export const isDesktop = `min-width: ${MIN_XXL_SIZE}px`
