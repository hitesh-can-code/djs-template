import { type UserContextInfo, UserContextRun } from "../../../../back/bases/UserContext";

export const info: UserContextInfo = {
    name: "Test optional right?",
}

export const run = UserContextRun(({ interaction }) => {
    interaction.reply(`👍`)
})