"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const error_1 = require("../controllers/error");
const router = express_1.Router();
router.use(error_1.notFoundHandler);
exports.default = router;
//# sourceMappingURL=error.js.map