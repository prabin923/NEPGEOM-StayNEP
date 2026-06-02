# NEPGEOM-StayNEP
# 🏔️ StayNEP Tourism Intelligence Network

### *When Location Becomes the Solution*

StayNEP Tourism Intelligence Network is a GIS-powered smart tourism platform designed to connect tourists, hotels, tourism authorities, and emergency services through real-time location intelligence.

The platform transforms fragmented tourism and hospitality data into a centralized ecosystem that improves tourist experiences, enhances safety, supports hotel operations, and enables data-driven tourism planning.

---

## Quick start (developers)

| Item | Location |
|------|----------|
| Next.js app | [`staynep/`](staynep/) |
| Setup & deploy guide | [staynep/README.md](staynep/README.md) |
| Environment template | [staynep/.env.example](staynep/.env.example) |

```bash
cd staynep
cp .env.example .env    # fill in DATABASE_URL, AUTH_SECRET, etc.
npm install
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up uses **email + password** (credentials auth via NextAuth).

**Deploy on Vercel:** set project **Root Directory** to `staynep`, then add Production env vars (`DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`). Details in [staynep/README.md](staynep/README.md).

---

# 📌 Table of Contents

- Overview
- Problem Statement
- Proposed Solution
- Objectives
- Key Features
- System Architecture
- Technology Stack
- Target Users
- Impact
- Innovation
- Future Scope
- Conclusion

---

# 🌍 Overview

Nepal's tourism industry is one of the country's largest economic sectors, yet it faces significant challenges due to fragmented information systems, lack of real-time data, safety concerns, and limited tourism intelligence.

StayNEP addresses these challenges by creating a centralized Tourism Intelligence Network that combines:

- Geographic Information Systems (GIS)
- Hotel Availability Data
- Tourism Analytics
- Safety Monitoring
- Emergency Accommodation Services
- AI-Powered Insights

The platform provides a single source of truth for tourism-related information across Nepal.

---

# 🚨 Problem Statement

Nepal's tourism sector currently faces several critical challenges:

### Poor Accessibility & Information Gaps
Tourists often struggle to find reliable accommodation and destination information.

### Fragmented Tourism Ecosystem
Hotels, tourists, authorities, and emergency services operate independently with limited coordination.

### Safety Risks
Natural disasters, weather disruptions, landslides, and road closures create uncertainty for travelers.

### Lack of Tourism Intelligence
Decision-makers lack access to real-time tourism analytics and demand insights.

### Seasonal Occupancy Fluctuations
Hotels experience extreme occupancy variations throughout the year, affecting profitability.

### Emergency Response Challenges
There is no centralized system to identify available accommodations during emergencies or travel disruptions.

---

# 💡 Proposed Solution

StayNEP creates a centralized location-aware tourism ecosystem by integrating GIS technology with hospitality and tourism data.

The platform provides:

- Real-time hotel availability
- Tourism mapping and discovery
- Occupancy intelligence
- Safety and risk monitoring
- Tourism analytics dashboards
- Emergency accommodation coordination

By leveraging location intelligence, StayNEP transforms tourism operations into a connected, data-driven network.

---

# 🎯 Objectives

## Primary Objectives

- Improve tourist accessibility to accommodation and travel information.
- Enhance traveler safety through location-based intelligence.
- Increase hotel visibility and occupancy rates.
- Support data-driven tourism planning.
- Build a connected tourism ecosystem for Nepal.

## Secondary Objectives

- Reduce information fragmentation.
- Improve disaster preparedness.
- Promote sustainable tourism growth.
- Enable smarter resource allocation.

---

# ⚙️ Key Features

## 1. GIS-Based Tourism Map

Interactive map displaying:

- Hotels
- Tourist Attractions
- Hospitals
- Police Stations
- Emergency Shelters
- Transportation Hubs

### Benefits
- Better navigation
- Location-based discovery
- Improved travel planning

---

## 2. Real-Time Hotel Availability

Hotels can update:

- Room availability
- Occupancy status
- Accommodation information

Tourists can instantly discover nearby available accommodations.

### Benefits
- Faster hotel discovery
- Improved occupancy management
- Better traveler convenience

---

## 3. Tourism Discovery System

Provides recommendations based on user location.

Includes:

- Attractions
- Hotels
- Restaurants
- Cultural Sites

### Benefits
- Enhanced tourist experience
- Better destination exploration

---

## 4. Tourism Safety Layer

Displays:

- Weather Alerts
- Landslide Zones
- Flood-Prone Areas
- Road Closures
- Emergency Services

### Benefits
- Safer travel decisions
- Improved risk awareness

---

## 5. Tourism Analytics Dashboard

Provides:

- Tourist Hotspots
- Occupancy Trends
- Regional Demand Analysis
- Tourism Performance Metrics

### Benefits
- Smarter planning
- Better business decisions

---

## 6. Emergency Accommodation Network

During:

- Flight Cancellations
- Natural Disasters
- Travel Disruptions

The system identifies available accommodation and assists travelers.

### Benefits
- Improved emergency response
- Better tourism resilience

---

# 🏗️ System Architecture

```text
Tourists
     │
     ▼
StayNEP Platform
     │
     ▼
API Layer
     │
 ┌───┼────────┬────────┐
 ▼   ▼        ▼        ▼
GIS Hotel   Safety   Tourism
Data Data   Data     Data
     │
     ▼
Analytics Engine
     │
     ▼
Dashboard & Insights
```

---

# 💻 Technology Stack

## Frontend

- Next.js
- React
- Tailwind CSS

## Backend

- Node.js
- Next.js API Routes

## Database

- Prisma

## GIS & Mapping

- Leaflet.js
- OpenStreetMap

## AI & Analytics

- Google Gemini API

---

# 👥 Target Users

## Tourists

- Discover accommodations
- Explore destinations
- Access safety information
- Plan travel efficiently

## Hotels

- Manage room availability
- Track occupancy
- Access tourism analytics
- Improve operational efficiency

## Tourism Authorities

- Monitor tourism activity
- Analyze trends
- Support policy and planning

## Emergency Services

- Coordinate disaster response
- Identify available accommodations
- Monitor affected regions

---

# 📈 Impact

## Impact on Tourists

- Easier accommodation discovery
- Better travel planning
- Improved safety awareness
- Faster emergency assistance

---

## Impact on Hotels

- Increased visibility
- Higher occupancy rates
- Better revenue forecasting
- Improved operational insights

---

## Impact on Tourism Authorities

- Real-time tourism intelligence
- Better resource allocation
- Improved destination management
- Data-driven decision making

---

## Impact on Nepal

- Smarter tourism ecosystem
- Increased tourism efficiency
- Improved disaster preparedness
- Sustainable tourism development

---

# 🚀 Innovation

Unlike traditional hotel management systems, StayNEP combines:

- GIS Technology
- Tourism Analytics
- Hospitality Data
- Safety Intelligence

into a single platform.

The project transforms hotel and tourism data into actionable location-based insights that support travelers, businesses, and authorities.

---

# 🔮 Future Scope

## Phase 1

- Tourism Mapping
- Hotel Discovery
- Safety Monitoring

## Phase 2

- AI-Based Recommendations
- Occupancy Forecasting
- Tourism Demand Prediction

## Phase 3

- National Tourism Intelligence Network
- Government Integration
- Advanced Analytics

## Phase 4

- Regional Expansion
- Cross-Border Tourism Intelligence
- Smart Destination Management

---

# 📊 Expected Outcomes

- Improved tourist experiences
- Increased hotel occupancy
- Enhanced tourism safety
- Better tourism planning
- Stronger disaster response capabilities
- Sustainable tourism growth

---

# 🏁 Conclusion

StayNEP Tourism Intelligence Network is a location-aware platform that connects tourism stakeholders through real-time geospatial data, tourism analytics, and hospitality intelligence.

By integrating GIS, tourism operations, safety monitoring, and accommodation data into a centralized system, StayNEP helps build a smarter, safer, and more connected tourism ecosystem for Nepal.

---


