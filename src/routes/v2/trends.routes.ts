import { Router } from "express";
import { getEndrangeSelectors, getRosSelectors, getServeSelectors } from "../../controller/trends/v2/trends.controller";

const router = Router();

router.get("/serve/selectors",getServeSelectors);
router.get("/ros/selectors",getRosSelectors);
router.get("/endrange/selectors",getEndrangeSelectors);





export default router;
