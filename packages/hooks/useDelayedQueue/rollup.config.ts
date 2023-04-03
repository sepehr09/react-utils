import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'index.ts',
    output: [
      {
        dir: 'dist/esm',
        format: 'esm',
      },
    ],
    external: ['react', 'react-dom'],
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: './tsconfig.json',
        useTsconfigDeclarationDir: true,
      }),
      terser(),
    ],
  },
  {
    input: 'index.ts',
    output: [
      {
        dir: 'dist/cjs',
        format: 'cjs',
      },
    ],
    external: ['react', 'react-dom'],
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: './tsconfig.cjs.json',
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          compilerOptions: {
            module: 'esnext',
          },
        },
      }),
      terser(),
    ],
  },
];
