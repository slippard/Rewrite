const { Command } = require("../../Nitro");

class LockDownCommand extends Command {

    async run({ message, bot, reply, t }) {
        const ms = message.args[0];
        const role = (message.args[1] || message.guild).id;

        const current = message.channel.permissionOverwrites.get(role);
        if (!current) current = null;
        else if (current.allow & 1 << 11) current = true;
        else if (current.deny & 1 << 11) current = false;

        await message.channel.overwritePermissions(role, { SEND_MESSAGES: false });
        await reply.warn(`Channel locked down for ${ms.toString()}.`, ' type `unlock` to end the lockdown.');

        async function end() {
            await message.channel.overwritePermissions(role, { SEND_MESSAGES: current });
            await reply.succ("Lockdown has ended.");
        }

        const timer = setTimeout(end, ms.milliseconds());

        const filt = m => m.member.checkPermission(m.channel, "MANAGE_CHANNELS")
        const c = message.channel.createMessageCollector(filt, ms.milliseconds());

        c.on("collect", m => {
            if (m.content.toLowerCase() === "unlock") { 
                clearTimeout(timer);
                end();
            }
        });
    }

    options() {
        return {
            help: "Lockdown the channel.",
            usage: "{}lockdown 30s",
            userPerms: ["MANAGE_CHANNELS"],
            botPerms: ["MANAGE_CHANNELS"],
            args: [{
                type: "duration",
                info: "The amount of time to lockdown for.",
                example: "2m30s",
                min: 1000,
                max: 36e6
            }, {
                type: "role",
                info: "Optional role to lockdown, instead of everyone",
                example: "@Users",
                default: null
            }]
        }
    }
}

module.exports = LockDownCommand;