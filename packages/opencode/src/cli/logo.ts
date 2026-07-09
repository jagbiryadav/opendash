export type LogoShape = {
  left: string[]
  right: string[]
}

export const logo: LogoShape = {
  left: [
    "",
    " ██████  ██████  ███████ ███    ██",
    "██    ██ ██   ██ ██      ████   ██",
    "██    ██ ██████  █████   ██ ██  ██",
    "██    ██ ██      ██      ██  ██ ██",
    " ██████  ██      ███████ ██   ████",
  ],
  right: [
    "",
    "██████   █████  ███████ ██   ██", 
    "██   ██ ██   ██ ██      ██   ██", 
    "██   ██ ███████ ███████ ███████", 
    "██   ██ ██   ██      ██ ██   ██", 
    "██████  ██   ██ ███████ ██   ██",                              
  ], 
}

export const logoThin: LogoShape = {
  left: [
    "",
    "▄████▄ █████▄ ██████ ███  ██",
    "██  ██ ██▄▄█▀ ██▄▄   ██ ▀▄██",
    "▀████▀ ██     ██▄▄▄▄ ██   ██",
  ],
  right: [
    "",                            
    "████▄  ▄████▄ ▄█████ ██  ██",
    "██  ██ ██▄▄██ ▀▀▀▄▄▄ ██████",
    "████▀  ██  ██ █████▀ ██  ██",
  ],
}

export const logos = {
  thin: logoThin,
  classic: logo,
} as const

export type LogoKey = keyof typeof logos

export const go = {
  left: ["    ", "█▀▀█", "█  █", "▀▀▀▀"],
  right: ["    ", "█▀▀▀", "█ __", "▀▀▀▀"],
}

export const marks = "_^~,"
