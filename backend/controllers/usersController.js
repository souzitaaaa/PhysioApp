import { supabase, supabaseAdmin } from "../services/supabaseService.js";
import crypto from 'crypto'

// GET | All Users
export async function getAllUsers(req, res) {
	const { data, error } = await supabase.from("v_user").select("*")
		.order("name", { ascending: true });

	if (error) return res.status(500).json({ error });
	return res.json(data);
}

// GET | User by ID
export async function getUserByID(req, res) {
	const userID = req.params.id;

	const { data, error } = await supabase
		.from("v_user")
		.select("*")
		.eq("userID", userID)
		.single();

	if (error) return res.status(500).json({ error });
	return res.json(data);
}

// POST |
export async function createUser(req, res) {
	try {
		const {
			name,
			birthdate,
			email,
			phoneNumber,
			pfp,
			nationality,
			usertypeID,
			notification_status,
		} = req.body

		if (!email || !name || !usertypeID) {
			return res.status(400).json({
				error: 'Missing required fields',
			})
		}

		// 🔐 Temporary password (user will reset it)
		const tempPassword = crypto.randomUUID().slice(0, 12)

		// 1️⃣ Create Supabase Auth user (ADMIN)
		const { data: authData, error: authError } =
			await supabaseAdmin.auth.admin.createUser({
				email,
				password: tempPassword,
				email_confirm: true,
			})

		if (authError) {
			return res.status(400).json({ error: authError.message })
		}

		const authUserId = authData.user.id

		// 2️⃣ Create your internal user
		const { data: userData, error: dbError } = await supabaseAdmin
			.from('t_user')
			.insert({
				auth_userID: authUserId, // ⚠️ make sure this column exists
				name,
				birthdate,
				email,
				phoneNumber,
				pfp,
				nationality,
				usertypeID,
				notification_status: !!notification_status,
			})
			.select('userID')
			.single()

		if (dbError) {
			// rollback auth user
			await supabaseAdmin.auth.admin.deleteUser(authUserId)
			return res.status(400).json({ error: dbError.message })
		}

		// 3️⃣ Force user to set their own password
		await supabaseAdmin.auth.admin.generateLink({
			type: 'recovery',
			email,
		})

		return res.status(201).json({
			message: 'User created successfully',
			userId: userData.userID,
		})
	} catch (err) {
		console.error(err)
		return res.status(500).json({
			error: 'Internal server error',
		})
	}
}

// DELETE | User
export async function deleteUser(req, res) {
	const userID = parseInt(req.params.id, 10);

	if (isNaN(userID))
		return res.status(400).json({ error: "Invalid user ID" });

	const { password } = req.body

	if (!password)
		return res.status(400).json({ error: "Password is required" });

	if (password !== process.env.DELETE_PASSWORD)
		return res.status(401).json({ error: "Invalid password" });

	const { data, error } = await supabase
		.from('t_user')
		.delete()
		.eq('userID', userID)
		.select('*');

	if (error)
		return res.status(500).json({ error });

	if (!data || data.length === 0)
		return res.status(404).json({ error: "Aser not found" });

	return res.json({ message: "User deleted successfully", data });
}
