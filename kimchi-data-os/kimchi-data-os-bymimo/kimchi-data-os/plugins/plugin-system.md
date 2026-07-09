# Plugin System

## Overview
Mechanism for adding new capabilities to Kimchi Data OS without modifying core components.

## Plugin Architecture

```
kimchi-data-os/
├── core/                           # Core system (read-only)
│   ├── SKILL.md
│   ├── agents/
│   ├── knowledge/
│   └── workflows/
│
├── plugins/                        # Plugin directory
│   ├── installed/                  # Installed plugins
│   │   ├── retail-analytics/
│   │   ├── healthcare-analytics/
│   │   └── custom-domain/
│   ├── marketplace/                # Available plugins
│   └── plugin-registry.yaml        # Plugin registry
│
└── user/                           # User customizations
    ├── agents/
    ├── knowledge/
    └── workflows/
```

## Plugin Specification

```yaml
# plugin.yaml - Plugin manifest
plugin:
  id: "plugin-retail-analytics"
  name: "Retail Analytics Plugin"
  version: "1.0.0"
  description: "Advanced retail analytics capabilities"
  author: "Kimchi Data OS Team"
  license: "MIT"
  
  # Plugin type
  type: "domain"  # domain, engine, workflow, knowledge
  
  # Dependencies
  requires:
    core_version: ">=3.0.0"
    plugins: []
    packages:
      - "retail-analytics>=1.0.0"
  
  # Capabilities provided
  capabilities:
    agents:
      - id: "agent-retail-analyst"
        name: "Retail Analyst"
        file: "agents/retail-analyst.md"
    
    knowledge:
      - id: "knowledge-retail"
        name: "Retail Analytics Knowledge"
        file: "knowledge/retail.md"
    
    workflows:
      - id: "workflow-inventory-optimization"
        name: "Inventory Optimization"
        file: "workflows/inventory-optimization.md"
    
    engines:
      - id: "engine-assortment"
        name: "Assortment Optimization Engine"
        file: "engines/assortment.py"
  
  # Configuration
  config:
    schema:
      type: "object"
      properties:
        store_count:
          type: "integer"
          description: "Number of stores to analyze"
        product_categories:
          type: "array"
          description: "Product categories to include"
  
  # Hooks
  hooks:
    pre_analysis: "hooks/pre_analysis.py"
    post_analysis: "hooks/post_analysis.py"
    on_error: "hooks/on_error.py"
```

## Plugin Manager

```python
import os
import yaml
import importlib.util
from pathlib import Path
from typing import Dict, List, Optional, Any

class PluginManager:
    """Manage plugin installation, loading, and lifecycle."""
    
    def __init__(self, core_path: str, plugins_path: str):
        self.core_path = Path(core_path)
        self.plugins_path = Path(plugins_path)
        self.installed_plugins: Dict[str, Plugin] = {}
        self.plugin_registry = self.load_registry()
    
    def load_registry(self) -> Dict:
        """Load plugin registry."""
        registry_path = self.plugins_path / "plugin-registry.yaml"
        if registry_path.exists():
            with open(registry_path, 'r') as f:
                return yaml.safe_load(f)
        return {"plugins": []}
    
    def discover_plugins(self) -> List[Dict]:
        """Discover available plugins."""
        discovered = []
        
        # Check installed plugins
        installed_path = self.plugins_path / "installed"
        if installed_path.exists():
            for plugin_dir in installed_path.iterdir():
                if plugin_dir.is_dir():
                    manifest = self.load_manifest(plugin_dir)
                    if manifest:
                        discovered.append({
                            "id": manifest["plugin"]["id"],
                            "name": manifest["plugin"]["name"],
                            "version": manifest["plugin"]["version"],
                            "path": plugin_dir,
                            "installed": True
                        })
        
        # Check marketplace
        marketplace_path = self.plugins_path / "marketplace"
        if marketplace_path.exists():
            for plugin_dir in marketplace_path.iterdir():
                if plugin_dir.is_dir():
                    manifest = self.load_manifest(plugin_dir)
                    if manifest:
                        discovered.append({
                            "id": manifest["plugin"]["id"],
                            "name": manifest["plugin"]["name"],
                            "version": manifest["plugin"]["version"],
                            "path": plugin_dir,
                            "installed": False
                        })
        
        return discovered
    
    def load_manifest(self, plugin_path: Path) -> Optional[Dict]:
        """Load plugin manifest."""
        manifest_path = plugin_path / "plugin.yaml"
        if manifest_path.exists():
            with open(manifest_path, 'r') as f:
                return yaml.safe_load(f)
        return None
    
    def install_plugin(self, plugin_id: str) -> bool:
        """Install a plugin."""
        # Find plugin in marketplace
        plugins = self.discover_plugins()
        plugin = next((p for p in plugins if p["id"] == plugin_id and not p["installed"]), None)
        
        if not plugin:
            print(f"Plugin {plugin_id} not found in marketplace")
            return False
        
        # Check dependencies
        manifest = self.load_manifest(plugin["path"])
        if not self.check_dependencies(manifest):
            print(f"Dependencies not met for {plugin_id}")
            return False
        
        # Copy to installed
        installed_path = self.plugins_path / "installed" / plugin_id
        self.copy_plugin(plugin["path"], installed_path)
        
        # Register plugin
        self.register_plugin(plugin_id, manifest)
        
        print(f"Plugin {plugin_id} installed successfully")
        return True
    
    def uninstall_plugin(self, plugin_id: str) -> bool:
        """Uninstall a plugin."""
        installed_path = self.plugins_path / "installed" / plugin_id
        if installed_path.exists():
            # Check if other plugins depend on this one
            dependents = self.get_dependents(plugin_id)
            if dependents:
                print(f"Cannot uninstall: other plugins depend on {plugin_id}")
                return False
            
            # Remove plugin
            import shutil
            shutil.rmtree(installed_path)
            
            # Unregister
            self.unregister_plugin(plugin_id)
            
            print(f"Plugin {plugin_id} uninstalled successfully")
            return True
        
        print(f"Plugin {plugin_id} not installed")
        return False
    
    def load_plugin(self, plugin_id: str) -> Optional['Plugin']:
        """Load a plugin."""
        if plugin_id in self.installed_plugins:
            return self.installed_plugins[plugin_id]
        
        plugin_path = self.plugins_path / "installed" / plugin_id
        if not plugin_path.exists():
            print(f"Plugin {plugin_id} not found")
            return None
        
        manifest = self.load_manifest(plugin_path)
        if not manifest:
            print(f"Invalid manifest for {plugin_id}")
            return None
        
        # Create plugin instance
        plugin = Plugin(plugin_id, manifest, plugin_path)
        
        # Initialize plugin
        if plugin.initialize():
            self.installed_plugins[plugin_id] = plugin
            return plugin
        
        return None
    
    def check_dependencies(self, manifest: Dict) -> bool:
        """Check if dependencies are met."""
        requires = manifest.get("plugin", {}).get("requires", {})
        
        # Check core version
        core_version = requires.get("core_version", ">=0.0.0")
        if not self.check_version(core_version):
            return False
        
        # Check plugin dependencies
        plugin_deps = requires.get("plugins", [])
        for dep in plugin_deps:
            if dep not in self.installed_plugins:
                return False
        
        # Check package dependencies
        package_deps = requires.get("packages", [])
        for package in package_deps:
            if not self.check_package(package):
                return False
        
        return True
    
    def check_version(self, version_spec: str) -> bool:
        """Check if version meets specification."""
        # Simplified version check
        return True
    
    def check_package(self, package_spec: str) -> bool:
        """Check if package is installed."""
        # Simplified package check
        return True
    
    def get_dependents(self, plugin_id: str) -> List[str]:
        """Get plugins that depend on given plugin."""
        dependents = []
        
        for pid, plugin in self.installed_plugins.items():
            deps = plugin.manifest.get("plugin", {}).get("requires", {}).get("plugins", [])
            if plugin_id in deps:
                dependents.append(pid)
        
        return dependents
    
    def copy_plugin(self, src: Path, dst: Path):
        """Copy plugin files."""
        import shutil
        shutil.copytree(src, dst)
    
    def register_plugin(self, plugin_id: str, manifest: Dict):
        """Register plugin in registry."""
        self.plugin_registry["plugins"].append({
            "id": plugin_id,
            "version": manifest["plugin"]["version"],
            "installed_at": "now"  # Use proper timestamp
        })
        
        registry_path = self.plugins_path / "plugin-registry.yaml"
        with open(registry_path, 'w') as f:
            yaml.dump(self.plugin_registry, f)
    
    def unregister_plugin(self, plugin_id: str):
        """Unregister plugin from registry."""
        self.plugin_registry["plugins"] = [
            p for p in self.plugin_registry["plugins"] if p["id"] != plugin_id
        ]
        
        registry_path = self.plugins_path / "plugin-registry.yaml"
        with open(registry_path, 'w') as f:
            yaml.dump(self.plugin_registry, f)


class Plugin:
    """Represents an installed plugin."""
    
    def __init__(self, plugin_id: str, manifest: Dict, path: Path):
        self.id = plugin_id
        self.manifest = manifest
        self.path = path
        self.config = {}
        self.hooks = {}
        self.loaded_modules = {}
    
    def initialize(self) -> bool:
        """Initialize the plugin."""
        try:
            # Load configuration
            self.config = self.load_config()
            
            # Load hooks
            self.load_hooks()
            
            # Load modules
            self.load_modules()
            
            return True
        except Exception as e:
            print(f"Failed to initialize plugin {self.id}: {e}")
            return False
    
    def load_config(self) -> Dict:
        """Load plugin configuration."""
        config_path = self.path / "config.yaml"
        if config_path.exists():
            with open(config_path, 'r') as f:
                return yaml.safe_load(f)
        return {}
    
    def load_hooks(self):
        """Load plugin hooks."""
        hooks = self.manifest.get("plugin", {}).get("hooks", {})
        for hook_name, hook_file in hooks.items():
            hook_path = self.path / hook_file
            if hook_path.exists():
                self.hooks[hook_name] = self.load_module(hook_path)
    
    def load_modules(self):
        """Load plugin modules."""
        capabilities = self.manifest.get("plugin", {}).get("capabilities", {})
        
        # Load agents
        for agent in capabilities.get("agents", []):
            agent_path = self.path / agent["file"]
            if agent_path.exists():
                self.loaded_modules[f"agent_{agent['id']}"] = self.load_module(agent_path)
        
        # Load engines
        for engine in capabilities.get("engines", []):
            engine_path = self.path / engine["file"]
            if engine_path.exists():
                self.loaded_modules[f"engine_{engine['id']}"] = self.load_module(engine_path)
    
    def load_module(self, path: Path):
        """Load a Python module from path."""
        spec = importlib.util.spec_from_file_location(
            path.stem,
            str(path)
        )
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return module
    
    def get_agent(self, agent_id: str):
        """Get an agent from the plugin."""
        return self.loaded_modules.get(f"agent_{agent_id}")
    
    def get_engine(self, engine_id: str):
        """Get an engine from the plugin."""
        return self.loaded_modules.get(f"engine_{engine_id}")
    
    def execute_hook(self, hook_name: str, context: Dict) -> Any:
        """Execute a plugin hook."""
        if hook_name in self.hooks:
            hook = self.hooks[hook_name]
            if hasattr(hook, 'execute'):
                return hook.execute(context)
        return None


class PluginRegistry:
    """Registry of available plugins."""
    
    def __init__(self):
        self.plugins = {}
    
    def register(self, plugin: Plugin):
        """Register a plugin."""
        self.plugins[plugin.id] = plugin
    
    def unregister(self, plugin_id: str):
        """Unregister a plugin."""
        if plugin_id in self.plugins:
            del self.plugins[plugin_id]
    
    def get(self, plugin_id: str) -> Optional[Plugin]:
        """Get a plugin by ID."""
        return self.plugins.get(plugin_id)
    
    def list_plugins(self) -> List[Dict]:
        """List all registered plugins."""
        return [
            {
                "id": plugin.id,
                "name": plugin.manifest["plugin"]["name"],
                "version": plugin.manifest["plugin"]["version"],
                "capabilities": list(plugin.manifest.get("plugin", {}).get("capabilities", {}).keys())
            }
            for plugin in self.plugins.values()
        ]
    
    def search(self, query: str) -> List[Plugin]:
        """Search plugins by name or capability."""
        results = []
        query_lower = query.lower()
        
        for plugin in self.plugins.values():
            name = plugin.manifest["plugin"]["name"].lower()
            desc = plugin.manifest["plugin"]["description"].lower()
            
            if query_lower in name or query_lower in desc:
                results.append(plugin)
        
        return results
```

## Plugin Development Guide

### Creating a New Plugin

```bash
# Create plugin structure
mkdir -p my-plugin/{agents,knowledge,workflows,engines,hooks}
cd my-plugin

# Create manifest
cat > plugin.yaml << 'EOF'
plugin:
  id: "plugin-my-analytics"
  name: "My Analytics Plugin"
  version: "1.0.0"
  description: "Custom analytics capabilities"
  author: "Your Name"
  license: "MIT"
  
  type: "domain"
  
  requires:
    core_version: ">=3.0.0"
    plugins: []
    packages: []
  
  capabilities:
    agents:
      - id: "agent-my-analyst"
        name: "My Analyst"
        file: "agents/my-analyst.md"
    
    knowledge:
      - id: "knowledge-my-domain"
        name: "My Domain Knowledge"
        file: "knowledge/my-domain.md"
    
    workflows:
      - id: "workflow-my-analysis"
        name: "My Analysis Workflow"
        file: "workflows/my-analysis.md"
  
  hooks:
    pre_analysis: "hooks/pre_analysis.py"
    post_analysis: "hooks/post_analysis.py"
EOF
```

### Plugin Hook System

```python
# hooks/pre_analysis.py
class PreAnalysisHook:
    """Hook that runs before analysis starts."""
    
    def execute(self, context: Dict) -> Dict:
        """
        Execute pre-analysis hook.
        
        Args:
            context: Analysis context containing:
                - data: Input data
                - config: Analysis configuration
                - user: User information
        
        Returns:
            Modified context
        """
        # Example: Add custom validation
        data = context.get("data")
        
        if data is not None:
            # Add custom validation
            validation_results = self.validate_data(data)
            context["pre_analysis_validation"] = validation_results
            
            # If validation fails, abort
            if not validation_results["passed"]:
                context["abort"] = True
                context["abort_reason"] = validation_results["errors"]
        
        return context
    
    def validate_data(self, data) -> Dict:
        """Custom data validation."""
        errors = []
        
        # Add your validation logic here
        if len(data) == 0:
            errors.append("Data is empty")
        
        return {
            "passed": len(errors) == 0,
            "errors": errors
        }
```

### Plugin Configuration

```yaml
# config.yaml
# Plugin-specific configuration

# Analysis settings
analysis:
  max_rows: 1000000
  default_confidence: 0.95
  
# Output settings
output:
  format: "markdown"
  include_charts: true
  
# Integration settings
integrations:
  database:
    enabled: false
    connection_string: ""
  
  api:
    enabled: false
    endpoints: []
```

## Plugin Installation

```bash
# Install from marketplace
kimchi plugin install retail-analytics

# Install from file
kimchi plugin install ./path/to/plugin.zip

# Install from git
kimchi plugin install git@github.com:user/plugin.git

# List installed plugins
kimchi plugin list

# Update plugin
kimchi plugin update retail-analytics

# Uninstall plugin
kimchi plugin uninstall retail-analytics
```

## Plugin API

```python
from kimchi.plugins import PluginManager, PluginRegistry

# Initialize plugin system
plugin_manager = PluginManager(
    core_path="/path/to/kimchi-data-os",
    plugins_path="/path/to/plugins"
)

# Discover available plugins
available = plugin_manager.discover_plugins()
print(f"Available plugins: {[p['name'] for p in available]}")

# Install a plugin
plugin_manager.install_plugin("retail-analytics")

# Load a plugin
plugin = plugin_manager.load_plugin("retail-analytics")

# Use plugin capabilities
agent = plugin.get_agent("retail-analyst")
result = agent.execute({"data": my_data})

# Execute plugin hook
context = plugin.execute_hook("pre_analysis", {"data": my_data, "config": config})
```

## Best Practices

### Plugin Development
1. **Keep plugins focused**: One clear purpose per plugin
2. **Follow contracts**: Use standard agent/engine contracts
3. **Document thoroughly**: Clear README and examples
4. **Test independently**: Plugin should work without core changes
5. **Version properly**: Semantic versioning

### Plugin Security
1. **Sandbox execution**: Plugins run in isolated context
2. **Permission system**: Explicit permission requests
3. **Code review**: Marketplace plugins require review
4. **Dependency scanning**: Check for vulnerabilities

### Plugin Compatibility
1. **Core version checks**: Ensure compatibility
2. **Dependency resolution**: Handle conflicts gracefully
3. **Graceful degradation**: Core works without plugins
4. **Backward compatibility**: Maintain API stability