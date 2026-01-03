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
			countryID,
			usertypeID,
			notification_status,
			password,
		} = req.body

		if (!email || !name || !usertypeID || !password) {
			return res.status(400).json({
				error: 'Missing required fields',
			})
		}

		// 1️⃣ Create Supabase Auth user with provided password
		const { data: authData, error: authError } =
			await supabaseAdmin.auth.admin.createUser({
				email,
				password,
				email_confirm: true,
			})

		if (authError) {
			return res.status(400).json({ error: authError.message })
		}

		const authUserId = authData.user.id

		// 2️⃣ Create internal user record
		const { data: userData, error: dbError } = await supabaseAdmin
			.from('t_user')
			.insert({
				auth_userID: authUserId,
				name,
				birthdate,
				email,
				phoneNumber,
				pfp,
				countryID,
				usertypeID,
				notification_status: !!notification_status,
			})
			.select('userID')
			.single()

		if (dbError) {
			await supabaseAdmin.auth.admin.deleteUser(authUserId)
			return res.status(400).json({ error: dbError.message })
		}

		return res.status(201).json({
			message: 'User created successfully',
			userId: userData.userID,
		})
	} catch (err) {
		console.error('Error creating user:', err)
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

	const { password } = req.body;

	if (!password)
		return res.status(400).json({ error: "Password is required" });

	if (password !== process.env.DELETE_PASSWORD)
		return res.status(401).json({ error: "Invalid password" });

	try {
		const { data: userData, error: fetchError } = await supabase
			.from('t_user')
			.select('auth_userID')
			.eq('userID', userID)
			.single();

		if (fetchError || !userData) {
			return res.status(404).json({ error: "User not found" });
		}

		const authUserId = userData.auth_userID;

		const { data: deletedUser, error: deleteError } = await supabase
			.from('t_user')
			.delete()
			.eq('userID', userID)
			.select('*')
			.single();

		if (deleteError) {
			return res.status(500).json({ error: deleteError });
		}

		if (authUserId) {
			const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(
				authUserId
			);

			if (authDeleteError) {
				console.error('Failed to delete auth user:', authDeleteError);
			}
		}

		return res.json({
			message: "User deleted successfully",
			data: deletedUser
		});

	} catch (err) {
		console.error('Error deleting user:', err);
		return res.status(500).json({
			error: 'Internal server error'
		});
	}
}
