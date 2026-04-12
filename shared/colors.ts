// src/constants/theme.ts

export const COLORS = {
    "main-primary": "#d08700",
    "main-secondary": "#ffff",
    "dark-primary": "#20233b",
    "dark-secondary": "#474c6e",
    "white": "#ffffff",
}

export const MAIN_THEME = {
  primary: COLORS["main-primary"],
  primaryHover: COLORS["main-secondary"],
} 

export const DARK_THEME = {
    primary: COLORS["white"],
    primaryHover: COLORS["dark-secondary"],
    background: COLORS["dark-primary"]
}