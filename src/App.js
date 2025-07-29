import React, { useState } from "react";
import helpDocs from "./doc.json";
import "./index.css";


export default function App() {
  // Dynamically import all images from /home folder
  const imageContext = require.context('./HelpDocsGifs', true, /\.(gif|png|jpe?g)$/);

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
  // Flatten all pages for sidebar and navigation
  const sidebarPages = allPages.flatMap(group => group.pages);
  // Find the index of the currently active page
  const currentIndex = sidebarPages.findIndex(p => p.slug === activeSlug);

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
                className={`nav-item ${page.slug === activeSlug ? "active" : ""
                  }`}
                onClick={() => setActiveSlug(page.slug)}>
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
              <p>{section.intro}</p>

              {section.imageUrl && imageMap[section.imageUrl] && (
                <img
                  src={imageMap[section.imageUrl]}
                  className="step-gif"
                  alt={section.heading}
                />
              )}

              {section.details && (
                <ol className="details-list">
                  {section.details.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
              )}
            </div>

          ))}
        <div className="nav-buttons">
          {currentIndex > 0 && (
            <button onClick={() => setActiveSlug(sidebarPages[currentIndex - 1].slug)}>Back</button>
          )}
          {currentIndex < sidebarPages.length - 1 && (
            <button onClick={() => setActiveSlug(sidebarPages[currentIndex + 1].slug)}>Next</button>
          )}
        </div>
      </main>
    </div>
  );
}
