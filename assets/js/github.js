'use strict';

(function () {
  const initGitHubGraph = () => {
    const placeholder = window.qs('.github-graph-placeholder');
    if (!placeholder) return;

    // Clear loading text
    placeholder.innerHTML = '';

    // Create the grid container
    const grid = document.createElement('div');
    grid.className = 'github-contribution-graph__placeholder';
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(52, 12px);
      grid-template-rows: repeat(7, 12px);
      gap: 3px;
    `;

    // 52 columns * 7 rows = 364 cells
    const totalCells = 52 * 7;
    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement('div');
      cell.className = 'github-contribution-graph__cell';
      cell.style.cssText = `
        width: 12px;
        height: 12px;
        border-radius: 2px;
        background: var(--bg-tertiary);
        transition: background var(--transition-fast);
      `;

      // Assign random contribution level
      const rand = Math.random();
      if (rand > 0.9) {
        cell.classList.add('github-contribution-graph__cell--l4');
        cell.style.background = 'var(--accent-primary)';
      } else if (rand > 0.8) {
        cell.classList.add('github-contribution-graph__cell--l3');
        cell.style.background = 'rgba(108, 92, 231, 0.65)';
      } else if (rand > 0.6) {
        cell.classList.add('github-contribution-graph__cell--l2');
        cell.style.background = 'rgba(108, 92, 231, 0.4)';
      } else if (rand > 0.4) {
        cell.classList.add('github-contribution-graph__cell--l1');
        cell.style.background = 'rgba(108, 92, 231, 0.2)';
      }

      grid.appendChild(cell);
    }

    placeholder.appendChild(grid);
  };

  document.addEventListener('DOMContentLoaded', initGitHubGraph);
})();
