const {
  MessageButton,
  MessageActionRow,
  MessageAttachment,
  MessageEmbed,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add_button")
    .setDescription("Smart switch")
    .addIntegerOption((option) =>
      option
        .setName("entity_id")
        .setDescription("Smart Switch ID")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("entity_name")
        .setDescription("Smart Switch name")
        .setRequired(true)
    ),
  async execute(interaction) {
    const id = interaction.options.getInteger("entity_id");
    const row1 = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("turn_on_" + id)
          .setLabel("Turn On")
          .setStyle("SUCCESS")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("turn_off" + id)
          .setLabel("Turn Off")
          .setStyle("DANGER")
      );

    const collector = interaction.channel.createMessageComponentCollector({});
    collector.on("collect", async (i) => {
      const id = interaction.options.getInteger("entity_id");
      if (id.toString() === i.customId.toString().slice(8)) {
        if (i.customId.startsWith("turn_on_")) {
          await fetch(
            "http://localhost:3333/rustPlus/turnSmartSwitchOn?id=" + id
          );
        } else if (i.customId.startsWith("turn_off")) {
          await fetch(
            "http://localhost:3333/rustPlus/turnSmartSwitchOff?id=" + id
          );
        }
        i.deferUpdate();
      }
    });

    const file = new MessageAttachment("./assets/smart.switch.png");
    const exampleEmbed = new MessageEmbed().setImage(
      "attachment://smart.switch.png"
    );

    const name = interaction.options.getString("entity_name");

    await interaction.reply({
      content: name,
      components: [row1],
      embeds: [exampleEmbed],
      files: [file],
    });
  },
};
