# Standalone Components Migration Plan

## Executive Summary

**Objective**: Convert the eForm Angular Frontend from module-based architecture to standalone components to enable Vitest testing and modernize the codebase.

**Timeline**: 2-3 weeks (phased approach)  
**Components Affected**: 166 components, 20+ modules  
**Risk Level**: Medium (can be done incrementally)  
**Plugin Impact**: Moderate - plugins will need updates but architecture supports it

---

## Current Architecture Analysis

### Components Inventory
- **Total Components**: 166 components
- **Current Status**: All marked as `standalone: false`
- **Feature Modules**: 20+ modules including:
  - Core app modules (auth, advanced, cases, etc.)
  - Plugin modules (PluginsModule, SharedPnModule)
  - Common modules (eform-shared, eform-cases, etc.)
  - Third-party integration modules

### Plugin System Architecture
**Current Plugin Loading**:
- `PluginsModule` in `src/app/plugins/`
- Dynamic route injection via `plugins.routing.ts`
- Plugin metadata in root `plugins.json`
- Example plugins: EFormCustomersPn, EFormTrashInspectionPn
- External plugin repositories (e.g., `eform-angular-items-planning-plugin`)

**Plugin Loading Mechanism**:
```typescript
// Current: Module-based lazy loading
{
  path: 'plugin-route',
  loadChildren: () => import('./plugin.module').then(m => m.PluginModule)
}
```

---

## Migration Strategy

### Phase 1: Preparation & Tooling (Days 1-2)

#### 1.1 Update Angular CLI & Schematics
```bash
# Ensure Angular CLI is up to date
ng update @angular/cli --migrate-only --from=20 --to=21

# Install standalone migration schematics (already in Angular 21)
# No additional packages needed
```

#### 1.2 Create Migration Checklist
- [ ] Backup current codebase (create branch `pre-standalone-migration`)
- [ ] Document current plugin loading patterns
- [ ] Identify shared dependencies and common imports
- [ ] Create test plan for each phase

#### 1.3 Setup Development Helpers
Create shared import collections for common dependencies:

```typescript
// src/app/common/standalone-imports.ts
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export const COMMON_FORM_IMPORTS = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  TranslateModule,
];

export const COMMON_DIALOG_IMPORTS = [
  CommonModule,
  MatDialogModule,
  MatButtonModule,
  TranslateModule,
];

// ... more collections as needed
```

### Phase 2: Automated Migration (Days 3-5)

#### 2.1 Run Angular Standalone Migration Schematic
```bash
# Step 1: Convert all components, directives, and pipes to standalone
ng generate @angular/core:standalone

# When prompted, select:
# - "Convert all components, directives, and pipes to standalone"
# - Run for all modules or specify paths incrementally
```

**What This Does**:
- Sets `standalone: true` on all components
- Adds `imports` array to each component with required dependencies
- Updates component tests automatically
- Maintains module structure initially for backwards compatibility

#### 2.2 Incremental Conversion by Feature Area
Start with leaf modules (fewest dependencies):

**Order of Migration**:
1. Common utility components (`eform-shared-tags`, `eform-cases`)
2. Standalone pages (dialogs, simple views)
3. Feature modules with minimal dependencies
4. Plugin system components
5. Core app structure (navigation, layout)
6. Root app component and bootstrapping

```bash
# Example: Migrate specific feature
ng generate @angular/core:standalone --path=src/app/modules/email-recipients
```

#### 2.3 Verify After Each Step
```bash
# Build application
ng build

# Run tests (will work once Vitest is unblocked)
ng test

# Check for compilation errors
npm run lint
```

### Phase 3: Plugin System Migration (Days 6-10)

#### 3.1 Understanding Plugin Impact

**Current Plugin Pattern**:
```typescript
// External plugin: eform-angular-items-planning-plugin
@NgModule({
  declarations: [ItemsPlanningComponent, ...],
  imports: [CommonModule, SharedPnModule, ...],
  providers: [ItemsPlanningService]
})
export class ItemsPlanningPnModule { }
```

**Standalone Plugin Pattern**:
```typescript
// Converted plugin component
@Component({
  selector: 'app-items-planning',
  standalone: true,
  imports: [
    CommonModule,
    // Direct imports of what's needed
    SharedPnImports,
    MatFormFieldModule,
    // ...
  ],
  providers: [ItemsPlanningService]
})
export class ItemsPlanningComponent { }
```

#### 3.2 Plugin Loading with Standalone Components

**Lazy Route Configuration Changes**:

```typescript
// OLD: plugins.routing.ts (module-based)
const routes: Routes = [
  {
    path: 'items-planning',
    loadChildren: () => import('./modules/items-planning-pn/items-planning-pn.module')
      .then(m => m.ItemsPlanningPnModule)
  }
];

// NEW: plugins.routing.ts (standalone-based)
const routes: Routes = [
  {
    path: 'items-planning',
    loadComponent: () => import('./modules/items-planning-pn/items-planning.component')
      .then(m => m.ItemsPlanningComponent)
  },
  // OR for feature with multiple routes:
  {
    path: 'items-planning',
    loadChildren: () => import('./modules/items-planning-pn/items-planning.routes')
      .then(m => m.ITEMS_PLANNING_ROUTES)
  }
];
```

#### 3.3 Plugin Architecture Changes

**Shared Plugin Module → Shared Standalone Exports**:

```typescript
// OLD: shared-pn.module.ts
@NgModule({
  imports: [CommonModule, MaterialModules, ...],
  exports: [CommonModule, MaterialModules, PnComponentsAndDirectives],
})
export class SharedPnModule { }

// NEW: shared-pn-imports.ts
export const SHARED_PN_IMPORTS = [
  CommonModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatDialogModule,
  MatTableModule,
  FormsModule,
  ReactiveFormsModule,
  TranslateModule,
  // ... all commonly used modules
];

// Usage in plugin components:
@Component({
  standalone: true,
  imports: [SHARED_PN_IMPORTS, PluginSpecificImports],
  // ...
})
export class PluginComponent { }
```

#### 3.4 Plugin Installation Script Changes

**Current `install.sh` Pattern**:
```bash
# Copies module files
# Updates plugins.routing.ts to import module
# Adds module to imports array
```

**New `install.sh` Pattern**:
```bash
# Copies standalone component files
# Updates plugins.routing.ts to add standalone route
# No module imports needed - components are self-contained
```

**Example Updated Install Script**:
```bash
#!/bin/bash
# ... copy plugin files ...

# Update plugins.routing.ts
# Find: // INSERT ROUTES HERE
# Insert:
cat <<EOF >> src/app/plugins/plugins.routing.ts
  {
    path: 'items-planning-pn',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/items-planning-pn/items-planning.routes').then(m => m.ITEMS_PLANNING_ROUTES)
  },
EOF
```

#### 3.5 Impact on External Plugins

**Changes Required for External Plugin Repos**:

1. **Component Conversion** (automated):
   ```bash
   cd eform-angular-items-planning-plugin
   ng generate @angular/core:standalone
   ```

2. **Remove NgModule** (or keep as backwards-compatible wrapper):
   ```typescript
   // Optional: Keep module for backwards compatibility during transition
   @NgModule({
     imports: [ItemsPlanningComponent] // Import standalone component
   })
   export class ItemsPlanningPnModule { }
   ```

3. **Create Routes File**:
   ```typescript
   // items-planning.routes.ts
   import { Routes } from '@angular/router';
   import { ItemsPlanningComponent } from './items-planning.component';

   export const ITEMS_PLANNING_ROUTES: Routes = [
     {
       path: '',
       component: ItemsPlanningComponent,
       children: [
         // ... child routes
       ]
     }
   ];
   ```

4. **Update Plugin Dependencies**:
   - Replace `SharedPnModule` import with `SHARED_PN_IMPORTS`
   - Add direct imports for Material components used
   - Update `package.json` peer dependencies if needed

**Migration Timeline for Plugins**:
- Core app migration: 2-3 weeks
- Plugin migration: Can be done incrementally, plugin by plugin
- Backwards compatibility: Both patterns can coexist during transition

### Phase 4: Remove Unnecessary Modules (Days 11-13)

#### 4.1 Run Module Removal Schematic
```bash
# Remove NgModules that are no longer needed
ng generate @angular/core:standalone

# When prompted, select:
# - "Remove unnecessary NgModule classes"
```

**Modules to Keep (temporarily)**:
- `AppModule` (until bootstrapping is converted)
- Modules with complex providers or APP_INITIALIZER
- Third-party module wrappers if needed

**Modules to Remove**:
- Feature modules that only declare/export components
- Routing modules (can be replaced with route arrays)
- Wrapper modules with no configuration

#### 4.2 Manual Cleanup
- Remove unused imports
- Consolidate routing files
- Update test configurations
- Remove empty module files

### Phase 5: Bootstrap Migration (Days 14-15)

#### 5.1 Convert to Standalone Bootstrap

```typescript
// OLD: main.ts (module-based)
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));

// NEW: main.ts (standalone)
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
```

#### 5.2 Create App Configuration

```typescript
// app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimations(),
    importProvidersFrom(
      TranslateModule.forRoot(translateConfig),
      // Other feature modules that provide configuration
    ),
    // App-wide providers
    AuthService,
    UserService,
    // ...
  ]
};
```

#### 5.3 Update Angular.json
```json
{
  "projects": {
    "eform-angular": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "main": "src/main.ts",
            // No need for polyfills in standalone
          }
        }
      }
    }
  }
}
```

### Phase 6: Testing & Vitest Integration (Days 16-18)

#### 6.1 Update Test Files

```typescript
// OLD: component.spec.ts (module-based)
TestBed.configureTestingModule({
  declarations: [MyComponent],
  imports: [FormsModule, MatDialogModule, ...],
  schemas: [NO_ERRORS_SCHEMA]
});

// NEW: component.spec.ts (standalone)
TestBed.configureTestingModule({
  imports: [MyComponent] // Import standalone component directly
});
// Component brings its own dependencies!
```

#### 6.2 Verify Vitest Works
```bash
# Run Vitest tests - should now work!
yarn test:unit

# Expected: All 31 test suites passing
# No more template compilation errors
```

#### 6.3 Remove Test Workarounds
- Remove `NO_ERRORS_SCHEMA` where not needed
- Remove manual module imports in tests
- Simplify test setup

### Phase 7: Documentation & Rollout (Days 19-21)

#### 7.1 Update Developer Documentation
- New component creation patterns
- Standalone component guidelines
- Plugin development guide (standalone version)
- Migration notes for external plugins

#### 7.2 Create Migration Guide for Plugin Developers
```markdown
# Plugin Migration to Standalone Components

## Quick Start
1. Run migration schematic: `ng generate @angular/core:standalone`
2. Replace `SharedPnModule` with `SHARED_PN_IMPORTS`
3. Create routes file instead of routing module
4. Update install script
5. Test integration with main app

## Compatibility
- Both module and standalone plugins supported during transition
- Recommended: Migrate to standalone within 3 months
```

#### 7.3 Communication Plan
- Announce migration to plugin maintainers
- Provide support during transition period
- Create migration support channel/issues

---

## Benefits After Migration

### For Core Application
1. **Vitest Testing Works**: No more template compilation errors
2. **Smaller Bundles**: Better tree-shaking, unused imports eliminated
3. **Faster Builds**: Simpler dependency graph
4. **Easier Development**: Less boilerplate, clearer dependencies
5. **Modern Patterns**: Aligned with Angular's future direction

### For Plugin System
1. **Simpler Plugin Structure**: No module wrapper needed
2. **Clearer Dependencies**: Each component lists what it needs
3. **Easier Lazy Loading**: Direct component loading
4. **Better Isolation**: Plugins are more self-contained
5. **Flexible Loading**: Can load individual components or feature sets

---

## Risk Mitigation

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing plugins | High | Maintain backwards compatibility layer, phased rollout |
| Complex provider configurations | Medium | Keep AppModule initially, migrate gradually |
| Third-party module incompatibilities | Medium | Use `importProvidersFrom` for legacy modules |
| Test infrastructure changes | Medium | Update tests incrementally alongside components |
| Build system issues | Low | Angular CLI handles most changes automatically |

### Plugin Ecosystem Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Plugin repos need updates | High | Provide migration tools and clear documentation |
| Transition period confusion | Medium | Support both patterns simultaneously |
| Plugin install scripts break | High | Update install script templates, provide examples |
| Dependency conflicts | Medium | Version lock core dependencies, test matrix |

### Mitigation Strategies
1. **Incremental Migration**: Modules and standalone can coexist
2. **Automated Tooling**: Use Angular schematics for most work
3. **Testing at Each Phase**: Verify build/tests after each step
4. **Rollback Plan**: Git branch for each phase
5. **Plugin Support**: Dedicated support period for external plugins

---

## Timeline & Resource Allocation

### Week 1: Foundation
- **Days 1-2**: Preparation, tooling setup, developer training
- **Days 3-5**: Automated migration of core components
- **Resource Needs**: 1 senior developer full-time

### Week 2: Plugin System
- **Days 6-10**: Plugin architecture migration, update examples
- **Resource Needs**: 1 senior + 1 developer for testing

### Week 3: Finalization
- **Days 11-13**: Module cleanup, optimization
- **Days 14-15**: Bootstrap conversion
- **Days 16-18**: Testing, Vitest integration
- **Days 19-21**: Documentation, rollout
- **Resource Needs**: 2 developers

**Total Effort**: ~3 person-weeks for core app  
**Plugin Updates**: Variable, per plugin (2-4 hours each)

---

## Success Criteria

### Must Have (Go/No-Go)
- ✅ Application builds without errors
- ✅ All existing features work
- ✅ Tests pass (with Vitest)
- ✅ At least one plugin successfully migrated
- ✅ Documentation complete

### Should Have
- ✅ Bundle size reduced by >10%
- ✅ Build time reduced by >15%
- ✅ All tests migrated to simplified setup
- ✅ Plugin migration guide tested by external team

### Nice to Have
- ✅ All external plugins migrated
- ✅ Performance benchmarks showing improvement
- ✅ Video tutorial for plugin developers

---

## Plugin-Specific Implications

### For External Plugin Repos (e.g., eform-angular-items-planning-plugin)

#### Required Changes
1. **Component Files**: Auto-converted by schematic
2. **Routing**: Replace routing module with routes array
3. **Dependencies**: Add explicit imports to components
4. **Install Script**: Update to use standalone routes
5. **Tests**: Simplify (import component directly)

#### Backwards Compatibility
```typescript
// Keep this temporarily for backwards compatibility
@NgModule({
  imports: [ItemsPlanningComponent]
})
export class ItemsPlanningPnModule {
  // Empty - just wraps standalone component
}
```

#### Installation Process Changes
**Before**: Plugin installs module file, adds to imports  
**After**: Plugin installs component/routes, adds route config

**Migration Path for Plugins**:
1. Core app migrates first (provides standalone infrastructure)
2. Update SharedPnModule → SharedPnImports
3. External plugins migrate one by one
4. Both patterns work during transition (6-12 months)
5. Eventually deprecate module-based plugins

#### Plugin Developer Experience
**Before**:
```typescript
// Lots of boilerplate
@NgModule({
  declarations: [15 components],
  imports: [20 modules],
  providers: [10 services],
  exports: [15 components]
})
export class MyPluginModule { }
```

**After**:
```typescript
// Clean, focused
@Component({
  standalone: true,
  imports: [SHARED_PN_IMPORTS, MySpecificImports],
  providers: [MyServices]
})
export class MyPluginComponent { }
```

---

## Conclusion

The migration to standalone components is a **modern Angular best practice** that:

1. **Solves the immediate problem**: Enables Vitest testing
2. **Future-proofs the codebase**: Aligns with Angular's direction
3. **Improves developer experience**: Less boilerplate, clearer code
4. **Enhances plugin architecture**: Simpler, more flexible plugins

**Recommendation**: Proceed with migration using the phased approach outlined above. The plugin system will actually become more flexible and easier to maintain after migration.

**Key Success Factor**: Communication with plugin maintainers and providing migration support during the transition period.
