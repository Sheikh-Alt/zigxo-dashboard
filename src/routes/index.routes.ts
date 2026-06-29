import { Router } from 'express';
import tenantRoutes         from './tenant.routes';
import deviceRoutes         from './device.routes';
import uploadRoutes         from './upload.routes';
import userRoutes           from './user.routes';
import agentRoutes          from './agent.routes';
import dataSourceRoutes     from './dataSource.routes';
import instructionSetRoutes from './instructionSet.routes';
import queryRoutes          from './query.routes';

const router = Router();

// ── Existing routes ───────────────────────────────────────────────────────────
router.use('/tenants',                        tenantRoutes);
router.use('/tenants/:tenantId/devices',      deviceRoutes);
router.use('/tenants/:tenantId/uploads',      uploadRoutes);
router.use('/users',                          userRoutes);

// ── Agents / RAG routes ───────────────────────────────────────────────────────
router.use('/agents',       agentRoutes);         // /api/v1/agents
router.use('/datasource',   dataSourceRoutes);    // /api/v1/datasource
router.use('/instructions', instructionSetRoutes); // /api/v1/instructions
router.use('/query',        queryRoutes);          // /api/v1/query

export default router;
