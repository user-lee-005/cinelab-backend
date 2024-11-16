const { db, collection } = require("../models/firebase");
const {
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
} = require("firebase/firestore");
const formidable = require("formidable");
const fs = require("fs");
const nodemailer = require("nodemailer");

const createEmailBody = (client) => {
  if (client.isBrochureDownloadDetails) {
    return {
      subject: "New Client Details Submitted for Downloading Brochure",
      text: `Client Details:
        Name: ${client.name}
        Email: ${client.email}
        Mobile: ${client.mobile},
        Profession: ${client.profession}`,
      html: `<p><b>Client Details:</b></p>
        <p><b>Name:</b> ${client.name}</p>
        <p><b>Email:</b> ${client.email}</p>
        <p><b>Mobile:</b> ${client.mobile}</p>
        <p><b>Profession:</b> ${client.profession}</p>`,
    };
  } else {
    return {
      subject: "New Client Details Submitted for Contacting Us",
      text: `Client Details:
        Name: ${client.name}
        Email: ${client.email}
        Message: ${client.message}`,
      html: `<p><b>Client Details:</b></p>
        <p><b>Name:</b> ${client.name}</p>
        <p><b>Email:</b> ${client.email}</p>
        <p><b>Message:</b> ${client.message}</p>`,
    };
  }
};

const sendEmail = async (client) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "cinelabmail@gmail.com",
        pass: "hzgqpwcixywurike",
      },
    });

    const mailOptions = {
      from: `"Website-${client.id}" cinelabmail@gmail.com`,
      to: "info.cinelab05@gmail.com",
      ...createEmailBody(client),
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
    const teamMembersRef = collection(db, "teamMembers");
    const teamMembersSnapshot = await getDocs(teamMembersRef);
    const teamMembers = teamMembersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.saveTeamMember = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.maxFileSize = 10 * 1024 * 1024;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    const { name, role } = fields;
    const file = files.file[0];

    try {
      const image = fs.readFileSync(file.filepath).toString("base64");

      const newMember = {
        name: name[0],
        role: role[0],
        image,
      };

      const teamMembersRef = collection(db, "teamMembers");
      const docRef = await addDoc(teamMembersRef, newMember);

      res.status(200).json({
        message: "Team member added successfully",
        id: docRef.id,
        teamMember: newMember,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

exports.updateTeamMember = async (req, res) => {
  const { id } = req.params;
  const form = new formidable.IncomingForm();
  form.maxFileSize = 10 * 1024 * 1024;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    const { name, role } = fields;
    const file = files.file && files.file[0];

    try {
      const teamMemberRef = doc(db, "teamMembers", id);
      const teamMemberSnapshot = await getDoc(teamMemberRef);

      if (!teamMemberSnapshot.exists()) {
        return res.status(404).json({ message: "Team member not found" });
      }

      let updatedImage = teamMemberSnapshot.data().image;
      if (file) {
        updatedImage = fs.readFileSync(file.filepath).toString("base64");
      }

      const updatedMember = {
        name: name ? name[0] : teamMemberSnapshot.data().name,
        role: role ? role[0] : teamMemberSnapshot.data().role,
        image: updatedImage,
      };

      await updateDoc(teamMemberRef, updatedMember);

      res.status(200).json({
        message: "Team member updated successfully",
        teamMember: updatedMember,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

exports.deleteTeamMember = async (req, res) => {
  const { id } = req.params;

  try {
    const teamMemberRef = doc(db, "teamMembers", id);
    await deleteDoc(teamMemberRef);

    res.status(200).json({ message: "Team member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.saveClientDetails = async (req, res) => {
  try {
    const {
      name,
      email,
      message,
      mobile,
      profession,
      isBrochureDownloadDetails,
    } = req.body;

    // Validation
    if (
      !name ||
      !email ||
      (isBrochureDownloadDetails && (!mobile || !profession))
    ) {
      return res.status(400).json({
        error:
          "Name, email, mobile, and profession are required for brochure download details.",
      });
    }

    const client = {
      name,
      email,
      message,
      mobile,
      profession,
      isBrochureDownloadDetails,
    };

    const docRef = await saveClientToFirestore(client);

    await sendEmail({ id: docRef.id, ...client });

    res.status(201).json({
      message: "Client details saved successfully",
      client: { id: docRef.id, ...client },
    });
  } catch (error) {
    console.error("Error saving client details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while saving client details." });
  }
};

const saveClientToFirestore = async (client) => {
  const clientsRef = collection(db, "clients");
  const docRef = await addDoc(clientsRef, client);
  return docRef;
};
