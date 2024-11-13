const { TeamMember, ClientInfo } = require("../models");
const formidable = require("formidable");
const fs = require("fs");
const nodemailer = require("nodemailer");

const sendEmail = async (client) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "cinelabmail@gmail.com",
        pass: "hzgqpwcixywurike",
      },
      debug: true,
    });

    let mailOptions = {
      from: `"Website-${client._id}" cinelabmail@gmail.com`,
      to: "info.cinelab05@gmail.com",
      subject: "New Client Details Submitted",
      text: `Client Details:
      Name: ${client.name}
      Email: ${client.email}
      Message: ${client.message}`,
      html: `<p><b>Client Details:</b></p>
      <p><b>Name:</b> ${client.name}</p>
      <p><b>Email:</b> ${client.email}</p>
      <p><b>Message:</b> ${client.message}</p>`,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return info.messageId;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

exports.getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find();
    const membersWithImages = teamMembers.map((member) => {
      const base64Image = member.image.toString("base64");
      return {
        ...member.toObject(),
        image: `data:image/jpg;base64,${base64Image}`,
      };
    });
    res.json(membersWithImages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.saveTeamMember = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    const { name, role } = fields;
    const file = files.file[0];

    try {
      const image = fs.readFileSync(file.filepath);

      const teamMember = new TeamMember({
        name: name[0],
        role: role[0],
        image,
      });

      await teamMember.save();

      res
        .status(200)
        .json({ message: "Team member added successfully", teamMember });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

exports.updateTeamMember = async (req, res) => {
  const { id } = req.params;
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    const { name, role } = fields;
    const file = files.file && files.file[0];

    try {
      const teamMember = await TeamMember.findById(id);

      if (!teamMember) {
        return res.status(404).json({ message: "Team member not found" });
      }

      let updatedImage = teamMember.image;
      if (file) {
        updatedImage = fs.readFileSync(file.filepath);
      }

      teamMember.name = name ? name[0] : teamMember.name;
      teamMember.role = role ? role[0] : teamMember.role;
      teamMember.image = updatedImage;

      await teamMember.save();

      res.status(200).json({
        message: "Team member updated successfully",
        teamMember,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

exports.deleteTeamMember = async (req, res) => {
  const { id } = req.params;

  try {
    const teamMember = await TeamMember.findById(id);

    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    await teamMember.remove();

    res.status(200).json({ message: "Team member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.saveClientDetails = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }

    const client = new ClientInfo({
      name,
      email,
      message,
    });

    await client.save();
    await sendEmail(client);

    res.status(201).json({
      message: "Client details saved successfully",
      client,
    });
  } catch (error) {
    console.error("Error saving client details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while saving client details." });
  }
};
