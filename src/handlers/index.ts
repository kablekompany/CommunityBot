import { readdirSync } from 'fs';
import { join } from 'path';

export default readdirSync(__dirname)
	.filter(l => l !== 'index.js')
	.map(l => require(join(__dirname, l)).default);
