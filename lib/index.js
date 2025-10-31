module.exports = {
  onPreBuild: async ({utils}) => {if(!process.env.DISCORD_WEBHOOK_URL) utils.build.failBuild("No webhook URL defined. Define one in the DISCORD_WEBHOOK_URL environmental variable")},
  onSuccess: async ({utils}) => {
    try {
      const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ content: `${process.env.DISCORD_WEBHOOK_MENTION ? `${process.env.DISCORD_WEBHOOK_MENTION} ` : ''}[${process.env.SITE_NAME}](<${process.env.DEPLOY_URL}>) deployed successfully at ${new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short', })}.\n View [logs](<https://app.netlify.com/sites/${process.env.SITE_NAME}/deploys/${process.env.DEPLOY_ID}>). BuildID: ${process.env.BUILD_ID}, context: ${process.env.CONTEXT}, commit: ${process.env.COMMIT_REF}` })
      })
      if (!response.ok) throw new Error(`Request ERROR: ${response.status}`)
    } catch (error) { utils.build.failPlugin(`Plugin ERROR: ${error.message}`) }
  },
  onError: async ({utils}) => {
    if (!process.env.DISCORD_WEBHOOK_URL) return utils.build.failPlugin(translatedMessages.noWebhook)
    try {
      const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ content: `${process.env.DISCORD_WEBHOOK_MENTION ? `${process.env.DISCORD_WEBHOOK_MENTION} ` : ''}\n# ⚠ [${process.env.SITE_NAME}](<${process.env.DEPLOY_URL}>) deploy FAILED at ${new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short', })} ⚠\n View [logs](<https://app.netlify.com/sites/${process.env.SITE_NAME}/deploys/${process.env.DEPLOY_ID}>). BuildID: ${process.env.BUILD_ID}, context: ${process.env.CONTEXT}` })
      })
      if (!response.ok) throw new Error(`Request ERROR: ${response.status}`);
    } catch (error) { utils.build.failPlugin(`Plugin ERROR: ${error.message}`) }
  }
}
