import jwt from "jsonwebtoken";

// Combined Authentication and Admin Role Check Middleware
const isAuthenticatedAndAdmin = async (req, res, next) => {
    try {
        // Retrieve token from cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        // Verify the token
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

        // Attach user ID and role to the request object
        req.id = decoded.userId;
        req.role = decoded.role;

        // Check if the user has an admin role
        if (req.role !== 'admin') {
            return res.status(403).json({
                message: "Access denied. Admins only.",
                success: false,
            });
        }

        // Proceed to the next middleware or route handler if authenticated and an admin
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export default isAuthenticatedAndAdmin;