import { app } from "./src/app.js";
import dotenv from 'dotenv';

dotenv.config()

// process.on('uncaughtException', (err) => {
//     console.log(err);
//     errorLogger.error(err);
//     process.exit(1);
// });

// process.on('unhandledRejection', (reason, promise) => {
//     console.error('Unhandled Rejection at:', promise, 'reason:', reason);
//     errorLogger.error('Unhandled Rejection:', reason);
//     process.exit(1);
// });

const PORT = process.env.PORT

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server error");
        console.log(err);
    };
    console.log(`Server is working on port ${PORT}`);
});


