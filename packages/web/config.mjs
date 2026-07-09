const stage = process.env.SST_STAGE || "dev"

export default {
  url: stage === "production" ? "https://openanalystai.netlify.app" : `https://${stage}.openanalystai.netlify.app`,
  console: stage === "production" ? "https://openanalystai.netlify.app/auth" : `https://${stage}.openanalystai.netlify.app/auth`,
  email: "contact@anoma.ly",
  socialCard: "https://social-cards.sst.dev",
  github: "https://github.com/openanalyst/openanalyst",
  discord: "https://openanalystai.netlify.app/discord",
  headerLinks: [
    { name: "app.header.home", url: "/" },
    { name: "app.header.docs", url: "/docs/" },
  ],
}
