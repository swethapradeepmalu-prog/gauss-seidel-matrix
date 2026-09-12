# gauss-seidel-matrix

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-gduijdwc)
# Gauss-Seidel Element-by-Element Calculator

An interactive, high-precision numerical web application built for a first-year BTech Computer Science & Engineering (CSE) Mathematics assignment. This application demonstrates the **Gauss-Seidel iterative method** for solving a system of linear algebraic equations ($Ax = b$).

## 🌐 Live Web Application
👉 [Click here to use the Live Running Calculator]https://github.com/swethapradeepmalu-prog/gauss-seidel-matrix.git

## 🧮 Project Highlights & Features
* **Element-by-Element Tracking:** Unlike static row-based calculators, this engine explicitly tracks and displays intermediate numerical values *immediately* after each individual variable ($x_1, x_2, x_3$) is updated within a single iteration step.
* **Immediate Feedback Loops:** Demonstrates how the Gauss-Seidel method leverages the freshest available variable approximations instantly instead of waiting for the next full iteration cycle.
* **Matrix Validation Warning:** Automatically evaluates the input matrix coefficients for **Diagonal Dominance** ($|a_{ii}| > \sum_{j \neq i} |a_{ij}|$). It triggers an active warning banner if the system is not dominant, demonstrating mathematical divergence criteria.
* **Variable Decimal Precision:** Supports configurable decimal configurations (up to 8 places) to study error margins and approximation thresholds.
* **Zero Graphical Overhead:** Focused completely on core numerical precision without heavy rendering scripts or charts, fulfilling academic lab presentation constraints.

## 📐 Mathematical Principle & Core Formulas
The calculator solves a 3x3 linear system by isolating the diagonal elements and applying immediate feedback loops:

1. **Calculate $x_1$:** 
   $$x_1^{(k+1)} = \frac{b_1 - a_{12}x_2^{(k)} - a_{13}x_3^{(k)}}{a_{11}}$$
2. **Calculate $x_2$ (Uses the brand new $x_1$ immediately):** 
   $$x_2^{(k+1)} = \frac{b_2 - a_{21}x_1^{(k+1)} - a_{23}x_3^{(k)}}{a_{22}}$$
3. **Calculate $x_3$ (Uses the brand new $x_1$ and $x_2$ immediately):** 
   $$x_3^{(k+1)} = \frac{b_3 - a_{31}x_1^{(k+1)} - a_{32}x_2^{(k+1)}}{a_{33}}$$

## 💻 Tech Stack
* **HTML5:** Structuring the matrix input matrices and numerical trace data tables.
* **CSS3:** Implementing clear micro-step highlight rows using an engineering-neutral layout scheme.
* **Vanilla JavaScript:** Executing high-precision iterative arithmetic operations dynamically in the client browser.

---
*Submitted as part of the First-Year BTech CSE Mathematics & Computational Methods Laboratory Assignment.*
