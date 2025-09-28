function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = "none";
  });

  const selected = document.getElementById(tabName + "-tab");
  if (selected) {
    selected.style.display = "block"; // Use "flex" if needed for layout
  }
}

const skillData = {
  personal: [
    "Collaboration and Teamwork",
    "Problem-Solving and Critical Thinking",
    "Analytical and Logical Reasoning",
    "Adaptability and Continuous Learning",
    "Attention to Detail",
    "Independent Research",
    "Self-Learning",
    "Time Management and Prioritization",
    "Peer Mentoring and Support"
  ],
  programming: [
    "Python",
    "Java",
    "C",
    "SQL",
    "R",
    "HTML & CSS",
    "JavaScript",
    "LATEX",
    "Markdown"
  ],
  tools: [
    "Jupyter Notebook",
    "Google Colab",
    "PyCharm",
    "IntelliJ",
    "Visual Studio Code",
    "Microsoft Office",
    "Amazon Web Services (AWS)",
    "Tableau",
    "KNIME",
    "Weka"
  ],
  competencies: [
    "Machine Learning",
    "Deep Learning",
    "Data Analytics",
    "Data Visualization",
    "Model Deployment",
    "Computer Vision",
    "Natural Language Processing",
    "Time Series Forecasting",
    "Model Evaluation & Tuning",
    "Computer Vision",
    "Supervised and Unsupervised Learning",
    "Data Collection and Preprocessing",
    " Research Paper Writing"
  ],
  libraries: [
    "NumPy",
    "Pandas",
    "Seaborn",
    "Matplotlib",
    "Scikit-learn",
    "TensorFlow",
    "Keras",
    "PyTorch",
    "XGBoost",
    "LightGBM",
    "GGPlot (R)",
    "OpenCV",
    "Tkinter",
    "SHAP",
    "UMAP",
    "PCA"
  ]
};

let selectedSkills = [];

function toggleSkill(button, category) {
  const isActive = selectedSkills.includes(category);

  if (isActive) {
    selectedSkills = selectedSkills.filter(c => c !== category);
    button.classList.remove("active");
  } else {
    if (selectedSkills.length === 2) {
      const removed = selectedSkills.shift(); // remove oldest
      const oldButton = document.querySelector(`.skill-tab[onclick*="${removed}"]`);
      if (oldButton) oldButton.classList.remove("active");
    }
    selectedSkills.push(category);
    button.classList.add("active");
  }

  updateSkillColumns();
}

function updateSkillColumns() {
  const leftBox = document.getElementById("skills-left");
  const rightBox = document.getElementById("skills-right");

  leftBox.innerHTML = selectedSkills[0]
    ? `<ul>${skillData[selectedSkills[0]]?.map(skill => `<li>${skill}</li>`).join("")}</ul>`
    : "";

  rightBox.innerHTML = selectedSkills[1]
    ? `<ul>${skillData[selectedSkills[1]]?.map(skill => `<li>${skill}</li>`).join("")}</ul>`
    : "";
}

window.onload = function () {
  const defaultSkills = ["programming", "libraries"];
  defaultSkills.forEach(skill => {
    const btn = document.querySelector(`.skill-tab[onclick*="'${skill}'"]`);
    if (btn) toggleSkill(btn, skill);
  });
};

