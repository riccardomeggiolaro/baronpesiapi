import { Router } from 'express';
import routerAuth from "./auth/auth.router";
import routerUser from "./user/user.router";
import routerInstallation from "./installation/installations.router";
import routerCard from "./card/cards.router";
import routerSubject from "./subject/subjects.router";
import routerEvent from "./event/events.router";

// Mount the secondary router for all of different path
const router = Router();

router.use("/auth", routerAuth); // Import the third router that contains all end points for the '/auth' path
router.use("/user", routerUser); // Import the third router that contains all end points for the '/user' path
router.use("/subject", routerSubject); // Import the third router that contains all end points for the '/subject' path
router.use("/card", routerCard); // Import the third router that contains all end points for the '/card' path
router.use("/installation", routerInstallation); // Import the third router that contains all end points for the '/installation' path
router.use("/event", routerEvent) // Import the third router that contains all end points for the '/event' path

export default router;