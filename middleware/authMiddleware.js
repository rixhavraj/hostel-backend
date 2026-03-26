const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
    let token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided!" });
    }

    // Handle "Bearer <token>" format
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimLeft();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
};


/*
The Security Guard (authMiddleware.js)
Goal: This code acts like a bouncer. It stands in front of private routes (like "Delete Booking") and checks if the user has a valid "Key" (Token).

Line 1: exports.auth = (req, res, next) => {

next: This is a special function that means "Let them pass to the next step."

Line 2: const token = req.header("Authorization");

It looks at the request headers (hidden data sent with every request) to see if the user attached their Token.

Line 4–7: if (!token) { ... }

The "No Ticket" Check: If there is no token in the header, we send a 401 Error (Unauthorized).

return: This keyword is vital. It stops the code immediately so it doesn't crash trying to verify a missing token.

Line 9: try {

We try to read the token.

Line 10: const decoded = jwt.verify(token, "SECRET_KEY");

The Scanner: We use the same "SECRET_KEY" from the login file to check if the token is real or fake.

Line 11: req.user = decoded;

Attaching Info: We attach the user's data (like their ID) to the request object. Now, the next part of the app knows exactly who is asking.

Line 12: next();

Open the Gate: The token is valid, so we run next(). This lets the request move on to the actual route (like "View Bookings").

Line 13–15: } catch (error) { ... }

If the token is expired or fake, the check fails, and we send a "Invalid Token" error.

TOKEN AND ALL
I am talking about the JSON Web Token (JWT).

Think of this token as a digital ID card or a wristband for a club.

Here is exactly where it comes from and how it gets to your middleware:

1. Where does the token come from? (The Login)
When you (the Admin) log in successfully using the code in authRoutes.js, the server creates this token using jwt.sign.

The Server says: "Okay, password is correct. Here is your Token. Keep it safe."

Your Frontend (React) says: "Thanks!" and saves this long string of random characters (usually in LocalStorage).

2. How does the middleware get it?
Every time the Admin tries to do something private (like viewing bookings), the Frontend must show the token to prove who they are.

The Frontend sends a request:

URL: GET /api/bookings

Header: Authorization: <YOUR_TOKEN_HERE>

The Middleware (authMiddleware.js) wakes up:

It looks at that specific Header line: req.header("Authorization").

If it finds the token there, it knows you are the Admin.
*/