import { Router } from 'express';
import routerAuth from "./auth/auth.router";
import routerUser from "./user/user.router";
import routerInstallation from "./installation/installations.router";
import routerCard from "./card/cards.router";
import routerSubject from "./subject/subjects.router";
import routerEvent from "./event/events.router";

const router = Router();

router.use("/auth", routerAuth);
router.use("/user", routerUser);
router.use("/subject", routerSubject);
router.use("/card", routerCard);
router.use("/installation", routerInstallation);
router.use("/event", routerEvent)

export default router;