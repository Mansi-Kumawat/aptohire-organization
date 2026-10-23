import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],root:'frontend',envDir:'..',server:{allowedHosts:true},test:{environment:'jsdom'},build:{outDir:'../dist',emptyOutDir:true}});