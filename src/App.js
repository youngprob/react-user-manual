import React, { useState } from "react";
import helpDocs from "./doc.json";
import "./index.css";
//import image from "../src/HelpDocsGifs/Admin/01_ClientsTable.gif";


export default function App() {
  // Dynamically import all images from /home folder
  const imageContext = require.context('./HelpDocsGifs', false, /\.(gif|png|jpe?g)$/);

  // Create a map: "sdf.gif" => image path
  const imageMap = {};
  imageContext.keys().forEach((key) => {
    const fileName = key.replace('./', '');
    imageMap[fileName] = imageContext(key);
  });
  const [selectedRole, setSelectedRole] = useState("");
  const [activeSlug, setActiveSlug] = useState("introduction");

  // Always visible: common pages
  const allPages = [
    { group: "Getting Started", pages: helpDocs.common }
  ];

  // If a role is selected, add its pages
  if (selectedRole && helpDocs.roles[selectedRole]) {
    allPages.push(...helpDocs.roles[selectedRole]);
  }

  // Find the active doc
  const activeDoc = allPages
    .flatMap(group => group.pages)
    .find(page => page.slug === activeSlug);

  return (
    <div className="container">
      <aside className="sidebar">
        <h1>User Manual</h1>

        <div className="role-selector">
          <label>Select Role:</label>
          <select
            value={selectedRole}
            onChange={e => {
              setSelectedRole(e.target.value);
              setActiveSlug("introduction");
            }}
          >
            <option value="">-- No Role Selected --</option>
            <option value="Admin">Admin</option>
            <option value="Audit Supervisor">Audit Supervisor</option>
            <option value="User">User</option>
          </select>
        </div>

        {allPages.map((group, i) => (
          <div key={i} className="nav-group">
            <div className="group-title">{group.group}</div>

            {group.pages.map(page => (
              <div
                key={page.slug}
                className={`nav-item ${
                  page.slug === activeSlug ? "active" : ""
                }`}
                onClick={() => setActiveSlug(page.slug)}
              >
                {page.title}
              </div>
            ))}
          </div>
        ))}
      </aside>

      <main className="main-content">
        <h1>{activeDoc.title}</h1>

        {Array.isArray(activeDoc.content)
          ? activeDoc.content.map((para, i) => <p key={i}>{para}</p>)
          : <p>{activeDoc.content}</p>}


        {activeDoc.sections &&
          activeDoc.sections.map((section, i) => (
            <div key={i} className="step-card">
              <h2>{section.heading}</h2>
              <p>{section.content}</p>
              <p>{section.imageUrl}</p>
              <img src={imageMap[section.imageUrl]} alt="image" />
              <img src={section.imageUrl} alt="image" />
            </div>
          ))}
      </main>
    </div>
  );
}
