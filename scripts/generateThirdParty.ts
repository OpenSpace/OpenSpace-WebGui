/**
 * Preprocessing script that parses a third-party license markdown file and
 * generates a static TypeScript data file at src/data/ThirdPartyDependencies.ts.
 *
 * Usage:
 *   npx tsx scripts/generateThirdParty.ts <path-to-license.md> [output-path]
 *
 * Example:
 *   npx tsx scripts/generateThirdParty.ts LICENSES.md
 *   npx tsx scripts/generateThirdParty.ts LICENSES.md src/data/ThirdPartyDependencies.ts
 *
 * Expected input format:
 *   A markdown file where each library has a section like:
 *
 *   ## Library Name
 *
 *   **License:** MIT
 *   **URL:** https://example.com
 *
 *   <full license text>
 */

import fs from 'fs';
import path from 'path';

interface Dependency {
  name: string;
  license: string;
  url: string;
  licenseText: string;
}

function parseMarkdown(content: string): Dependency[] {
  // Split into sections on lines that start a new ## heading.
  // The first chunk is the intro/table — skip it.
  const chunks = content.split(/\n(?=## )/);

  const dependencies: Dependency[] = [];

  for (const chunk of chunks.slice(1)) {
    const lines = chunk.split('\n');

    const name = lines[0].replace(/^##\s+/, '').trim();

    const licenseMatch = chunk.match(/^\*\*License:\*\*\s*(.+)$/m);
    const urlMatch = chunk.match(/^\*\*URL:\*\*\s*(.+)$/m);

    if (!licenseMatch || !urlMatch) {
      console.warn(`Skipping section "${name}": missing License or URL field.`);
      continue;
    }

    const license = licenseMatch[1].trim();
    const url = urlMatch[1].trim();

    // License text is everything after the **URL:** line.
    const urlLineIndex = lines.findIndex((l) => l.startsWith('**URL:**'));
    const licenseText = lines
      .slice(urlLineIndex + 1)
      .join('\n')
      .trim();

    dependencies.push({ name, license, url, licenseText });
  }

  return dependencies;
}

function generateTypeScript(dependencies: Dependency[]): string {
  const entries = dependencies
    .map((dep) => {
      return [
        `  {`,
        `    name: ${JSON.stringify(dep.name)},`,
        `    license: ${JSON.stringify(dep.license)},`,
        `    url: ${JSON.stringify(dep.url)},`,
        `    licenseText: ${JSON.stringify(dep.licenseText)}`,
        `  }`
      ].join('\n');
    })
    .join(',\n');

  return `// This file is auto-generated. Do not edit manually.
// To regenerate, run:
//   npx tsx scripts/generateThirdParty.ts <path-to-license.md>

export interface ThirdPartyDependency {
  name: string;
  license: string;
  url: string;
  licenseText: string;
}

export const ThirdPartyDependencies: ThirdPartyDependency[] = [
${entries}
];
`;
}

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('Error: No input file specified.');
    console.error('Usage: npx tsx scripts/generateThirdParty.ts <path-to-license.md>');
    process.exit(1);
  }

  const resolvedInput = path.resolve(inputPath);
  if (!fs.existsSync(resolvedInput)) {
    console.error(`Error: File not found: ${resolvedInput}`);
    process.exit(1);
  }

  const outputPath = path.resolve(
    process.argv[3] ?? 'src/data/ThirdPartyDependencies.ts'
  );

  const content = fs.readFileSync(resolvedInput, 'utf-8');
  const dependencies = parseMarkdown(content);

  if (dependencies.length === 0) {
    console.error('Error: No dependency sections found in the input file.');
    process.exit(1);
  }

  const output = generateTypeScript(dependencies);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, output, 'utf-8');

  console.log(`Parsed ${dependencies.length} dependencies.`);
  console.log(`Written to: ${outputPath}`);
}

main();
