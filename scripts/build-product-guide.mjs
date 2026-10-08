import fs from 'node:fs';
import { createHash } from 'node:crypto';
const taxonomy=JSON.parse(fs.readFileSync(new URL('../public/assets/categories.json',import.meta.url)));
const steps=[], ids=new Map(), leaves=[];
const children=n=>(n.itemListElement||[]).map(e=>e.item);
const key=n=>'cat_'+createHash('sha256').update(n.identifier||n.name).digest('hex').slice(0,12);
const step=(id,type,prompts,options=[],config={},columns=[])=>({id,step_type:type,step_prompts:prompts,step_options:options,step_config:config,step_columns:columns,step_description:''});
const opt=(label,goto,description='',icon='')=>({label,goto,description,icon});
function collect(n){ids.set(n.name,key(n));children(n).forEach(collect)}
children(taxonomy).forEach(collect);
steps.push(step('welcome','single_select',['Let’s find the right\nstarting point.'],[
 opt('HVAC & controls',ids.get('HVAC & Controls'),'Air quality, heating, cooling and controls','build'),
 opt('Plumbing',ids.get('Plumbing'),'Pipes, valves, pumps and water systems','home'),
 opt('Electrical',ids.get('Electrical'),'Power, wiring, switching and networking','bolt'),
 opt('Help me choose','choose','Start with the job you’re doing','help'),
 opt('I have a part number','part-number','Go straight to Blackhawk’s search','search'),
]));
steps[0].step_description='Explore Blackhawk Supply’s catalog with a few guided choices.';
steps.push(step('choose','single_select',['What are you working on?'],[
 opt('Temperature, airflow or building controls',ids.get('HVAC Controls'),'Sensors, thermostats and actuators'),
 opt('Heating or cooling equipment',ids.get('Heating & Cooling'),'Explore equipment and replacement-part categories'),
 opt('Air quality or ventilation',ids.get('Air Quality & Ventilation'),'Filtration, humidity and ventilation'),
 opt('Moving or treating water','water','Pumps, piping, filtration and hydronics'),
 opt('Power, wiring or connections',ids.get('Electrical'),'Find the electrical product family'),
]));
steps.push(step('water','single_select',['Which part of the water system do you need?'],[
 opt('Move water',ids.get('Pumps')),opt('Pipe connections',ids.get('Pipes & Fittings')),opt('Water filtration',ids.get('Water Filtration')),opt('Hydronic heating',ids.get('Hydronics')),opt('Browse all plumbing',ids.get('Plumbing')),
]));
steps.push(step('part-number','message',['Already have a manufacturer’s part number?','Search it on Blackhawk Supply to check the current listing and specifications.'],[],{terminal:true,cta:{label:'Search Blackhawk Supply',url:'https://blackhawksupply.com/search'}}));
function build(n,path=[]){
 const kids=children(n), id=key(n), trail=[...path,n.name];
 const url=new URL(n.url);if(url.protocol!=='https:'||url.hostname!=='blackhawksupply.com')throw Error('Unexpected category URL');
 if(!kids.length){
  leaves.push({name:n.name,url:n.url,path:trail,id});
  steps.push(step(id,'message',[`${n.name} is your starting point.`,`${trail.slice(0,-1).join(' → ')}\nOpen this collection to compare products and check specifications, availability and pricing.`],[],{terminal:true,cta:{label:`Browse ${n.name}`,url:n.url}}));return;
 }
 const size=5;
 for(let start=0;start<kids.length;start+=size){
  const page=start/size;
  const choices=kids.slice(start,start+size).map(k=>opt(k.name,key(k)));
  if(start+size<kids.length)choices.push(opt('More categories',`${id}_${page+1}`));
  steps.push(step(page?`${id}_${page}`:id,'single_select',[page?`More in ${n.name}`:`Let’s narrow down ${n.name}.`,`Which category fits your project?`],choices));
 }
 kids.forEach(k=>build(k,trail));
}
children(taxonomy).forEach(n=>build(n));
const definition={
 mag_id:'blackhawk-product-guide',mag_title:'Blackhawk Supply',mag_subtitle:'Your product guide',
 mag_display_mode:'inline',mag_trigger:'on_load',mag_inline_width:'100%',mag_inline_height:'720px',
 mag_presentation_style:'assistant',mag_theme_mode:'light',mag_theme_color:'#b7470a',mag_font:'Arial, Helvetica, sans-serif',
 mag_theme_vars:{surface:'#ffffff',surface_2:'#f6f7f8',msg_bg:'#ffffff',bot_bg:'#f0f3f6',border:'#dce2e8',bot_border:'#dce2e8',text:'#142235',text_sub:'#4b5a6d',meta:'#4b5a6d',radius:'20px',radius_msg:'14px'},
 mag_visual_style:'modern',mag_motion_style:'fade',mag_message_style:'soft',
 mag_logo_url:'https://mach-five-group.github.io/magnet_hvac_b2b/assets/blackhawk-guide-mark.svg',
 mag_home:false,mag_summary:false,mag_hide_launcher:true,mag_visitor_controls:false,
 mag_macro_steps:steps,
};
fs.writeFileSync(new URL('../magnet/definition.json',import.meta.url),JSON.stringify(definition,null,2)+'\n');
fs.writeFileSync(new URL('../magnet/taxonomy-manifest.json',import.meta.url),JSON.stringify({source:'public/assets/categories.json',sha256:createHash('sha256').update(JSON.stringify(taxonomy)).digest('hex'),departments:3,leafCategories:leaves.length,steps:steps.length,leaves},null,2)+'\n');
console.log(`Built ${steps.length} steps covering ${leaves.length} category destinations.`);
