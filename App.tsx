
import React, { useState } from 'react';
import { ProfileData, Project } from './types';
import { THEMES } from './constants';
import { enhanceBio, generateProjectDescription } from './services/gemini';

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7v14"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>;
const MagicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3Z"/></svg>;

const App: React.FC = () => {
  const [data, setData] = useState<ProfileData>({
    name: 'Jane Doe',
    title: 'Product Designer',
    bio: 'Focusing on clean interfaces and meaningful experiences.',
    location: 'Bangkok, Thailand',
    skills: ['Interface Design', 'Prototyping', 'React', 'Figma'],
    projects: [
      { id: '1', name: 'Minimal Case Study', description: 'A deep dive into reductionist design patterns.', link: '#' }
    ],
    social: { github: '', linkedin: '', twitter: '', email: 'jane@minimal.com' },
    theme: 'modern'
  });

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'projects' | 'theme'>('info');

  const updateField = (path: string, value: any) => {
    const newData = { ...data };
    const parts = path.split('.');
    let current: any = newData;
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    setData(newData);
  };

  const handleEnhanceBio = async () => {
    setIsEnhancing(true);
    const newBio = await enhanceBio(data.name, data.title, data.bio);
    updateField('bio', newBio);
    setIsEnhancing(false);
  };

  const addProject = () => {
    const newProj: Project = { id: Date.now().toString(), name: 'Untitled Project', description: '', link: '#' };
    setData({ ...data, projects: [...data.projects, newProj] });
  };

  const removeProject = (id: string) => {
    setData({ ...data, projects: data.projects.filter(p => p.id !== id) });
  };

  const polishProject = async (index: number) => {
    const projectName = data.projects[index].name;
    const newDesc = await generateProjectDescription(projectName);
    const newProjects = [...data.projects];
    newProjects[index].description = newDesc;
    setData({ ...data, projects: newProjects });
  };

  const currentTheme = THEMES[data.theme];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Editor Section */}
      <div className="w-full md:w-[400px] lg:w-[450px] p-6 md:p-10 overflow-y-auto max-h-screen border-r border-slate-100">
        <header className="mb-10">
          <h1 className="text-xl font-medium tracking-tight text-black">
            GitProfile <span className="text-slate-400 font-light">Builder</span>
          </h1>
        </header>

        <div className="flex gap-6 mb-8">
          {(['info', 'projects', 'theme'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-semibold tracking-widest uppercase transition-all pb-1 ${
                activeTab === tab ? 'text-black border-b border-black' : 'text-slate-300 hover:text-slate-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {activeTab === 'info' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={data.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full text-sm py-2 border-b border-slate-100 focus:border-black outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Professional Title"
                  value={data.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full text-sm py-2 border-b border-slate-100 focus:border-black outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Biography</span>
                  <button onClick={handleEnhanceBio} className="text-[10px] uppercase font-bold text-black flex items-center gap-1 hover:opacity-50 transition-opacity">
                    <MagicIcon /> {isEnhancing ? '...' : 'Enhance'}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={data.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                  className="w-full text-sm p-3 bg-slate-50 rounded border-none focus:ring-1 focus:ring-black outline-none transition-all resize-none"
                />
              </div>

              <input
                type="text"
                placeholder="Skills (Separated by comma)"
                value={data.skills.join(', ')}
                onChange={(e) => updateField('skills', e.target.value.split(',').map(s => s.trim()))}
                className="w-full text-sm py-2 border-b border-slate-100 focus:border-black outline-none transition-colors"
              />
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">Projects</span>
                <button onClick={addProject} className="p-1 hover:bg-slate-50 rounded transition-colors"><PlusIcon /></button>
              </div>
              {data.projects.map((proj, idx) => (
                <div key={proj.id} className="group relative p-4 bg-slate-50 rounded-lg space-y-2">
                  <button onClick={() => removeProject(proj.id)} className="absolute top-4 right-4 text-slate-300 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon /></button>
                  <input
                    placeholder="Project Name"
                    value={proj.name}
                    onChange={(e) => {
                      const newProjs = [...data.projects];
                      newProjs[idx].name = e.target.value;
                      setData({...data, projects: newProjs});
                    }}
                    className="bg-transparent w-full text-sm font-semibold outline-none border-b border-transparent focus:border-slate-200"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      placeholder="Brief description"
                      value={proj.description}
                      onChange={(e) => {
                        const newProjs = [...data.projects];
                        newProjs[idx].description = e.target.value;
                        setData({...data, projects: newProjs});
                      }}
                      className="bg-transparent w-full text-xs text-slate-500 outline-none"
                    />
                    <button onClick={() => polishProject(idx)} className="text-slate-400 hover:text-black"><MagicIcon /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-300">
              {Object.entries(THEMES).map(([id, config]) => (
                <button
                  key={id}
                  onClick={() => setData({ ...data, theme: id as any })}
                  className={`p-4 rounded border transition-all text-left ${
                    data.theme === id ? 'border-black' : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-full h-8 mb-2 ${config.primary} border border-slate-100`}></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{id}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <footer className="mt-20">
          <button 
            className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all"
            onClick={() => {
              const element = document.createElement("a");
              const file = new Blob([JSON.stringify(data, null, 2)], {type: 'text/plain'});
              element.href = URL.createObjectURL(file);
              element.download = "profile.json";
              document.body.appendChild(element);
              element.click();
            }}
          >
            Export Profile
          </button>
        </footer>
      </div>

      {/* Preview Section */}
      <div className={`flex-1 overflow-y-auto p-8 md:p-20 ${currentTheme.background} transition-colors duration-500`}>
        <div className="max-w-xl mx-auto space-y-24">
          <section className="space-y-8">
            <div className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden">
              <img src={`https://picsum.photos/seed/${data.name}/200`} alt="" className="w-full h-full object-cover grayscale" />
            </div>
            <div className="space-y-2">
              <h2 className={`text-4xl font-light tracking-tight ${currentTheme.text}`}>{data.name}</h2>
              <p className={`text-sm font-semibold uppercase tracking-[0.3em] opacity-40 ${currentTheme.text}`}>{data.title}</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className={`text-[10px] font-bold uppercase tracking-[0.3em] opacity-30 ${currentTheme.text}`}>About</h3>
            <p className={`text-xl font-light leading-relaxed max-w-lg ${currentTheme.text}`}>
              {data.bio}
            </p>
          </section>

          <section className="space-y-6">
             <h3 className={`text-[10px] font-bold uppercase tracking-[0.3em] opacity-30 ${currentTheme.text}`}>Focus</h3>
             <div className="flex flex-wrap gap-x-8 gap-y-4">
               {data.skills.map(skill => (
                 <span key={skill} className={`text-sm font-medium ${currentTheme.text} border-b border-transparent hover:border-current cursor-default transition-all`}>
                   {skill}
                 </span>
               ))}
             </div>
          </section>

          <section className="space-y-8">
            <h3 className={`text-[10px] font-bold uppercase tracking-[0.3em] opacity-30 ${currentTheme.text}`}>Projects</h3>
            <div className="space-y-12">
              {data.projects.map(proj => (
                <div key={proj.id} className="group cursor-pointer">
                  <h4 className={`text-lg font-medium mb-1 ${currentTheme.text}`}>{proj.name}</h4>
                  <p className={`text-sm font-light leading-relaxed opacity-60 mb-3 ${currentTheme.text}`}>{proj.description}</p>
                  <div className={`text-[10px] font-bold uppercase tracking-widest ${currentTheme.text} opacity-40 group-hover:opacity-100 transition-opacity underline underline-offset-4`}>
                    Explore Project
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer className="pt-20 pb-10 flex justify-between items-center opacity-20 hover:opacity-100 transition-opacity">
             <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${currentTheme.text}`}>© {new Date().getFullYear()}</p>
             <div className="flex gap-4">
               {['GitHub', 'LinkedIn', 'Twitter'].map(link => (
                 <span key={link} className={`text-[10px] font-bold uppercase tracking-widest ${currentTheme.text}`}>{link}</span>
               ))}
             </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default App;
